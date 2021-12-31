const axios = require('axios')
const { addUser, getUncrawledUserId, markUserAsCrawled, checkIfUserExists } = require('./database/queries')
require('dotenv').config()

const main = async () => {
    try {
        let userId = '1451369381779447809'
        let next = -1
        let usersList = []
        while(true) {
            while(next !== 0) {
                const data = await sendRequest(userId, next)
                sleep(66000)
                usersList = [...usersList, ...data.users]
                console.log(`Got = ${usersList.length}`)
                next = data.next_cursor
            }

            const solUsers = getFilteredUsers(usersList)
            await saveInDatabase(solUsers)
            if(userId !== '1451369381779447809') {
                await markUserAsCrawled(userId)
            }
            console.log('User Done.')

            next = -1
            usersList = []
            userId = await getUncrawledUserId()
        }
    }
    catch (e) {
     console.log(e)
    }
}

const sendRequest = async (userId, cursor) => {
    try {
        const { data } = await axios.get(`https://api.twitter.com/1.1/followers/list.json?user_id=${userId}&count=200&cursor=${cursor}`,{
            headers: {
                Authorization:
                    `Bearer ${process.env.token}`,
                'Content-Type': 'application/x-www-form-urlencoded',
            },
        })
        return data
    }
    catch (e) {
        console.log(e)
    }
}

const getFilteredUsers = (usersList) => {
    let filteredUsers = []
    for(let i = 0; i < usersList.length; i++) {
        let temp_name = usersList[i].name.toLowerCase()
        if(temp_name.includes('.sol')) {
            filteredUsers.push(usersList[i])
        }
    }
    return filteredUsers;
}

const saveInDatabase = async (solUsers) => {
    for(let i = 0; i < solUsers.length; i++) {
        let user = await checkIfUserExists(solUsers[i].id_str)
        if(user.length === 0) {
            await addUser(solUsers[i])
        }
    }
}

function sleep(milliseconds) {
    const date = Date.now();
    let currentDate = null;
    do {
        currentDate = Date.now();
    } while (currentDate - date < milliseconds);
}

// Start Function
main().catch((e) => {
    console.log(e)
})