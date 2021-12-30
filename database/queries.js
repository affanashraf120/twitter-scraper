const conn = require('./conn')

module.exports = {
    addUser: (user) => {
        return new Promise((resolve, reject) => {
            const sql =`INSERT INTO user(twitter_user_id, sns_domain_name, scraped_at, raw_data, state) VALUES(?, ?, NOW(), ?, ?)`
            conn.query(sql, [user.id_str, user.name, JSON.stringify(user), 'uncrawled'], (err, rows) => {
                if (err)
                    reject(err)
                else
                    resolve(rows)
            })
        })
    },

    getUncrawledUserId: () => {
        return new Promise((resolve, reject) => {
            const sql =`SELECT twitter_user_id FROM user WHERE state = 'uncrawled' LIMIT 1`
            conn.query(sql, [], (err, rows) => {
                if (err)
                    reject(err)
                else
                    resolve(rows[0].twitter_user_id)
            })
        })
    },

    markUserAsCrawled: (userId) => {
        return new Promise((resolve, reject) => {
            const sql =`UPDATE user SET state = 'crawled' WHERE twitter_user_id = ?`
            conn.query(sql, [userId], (err, rows) => {
                if (err)
                    reject(err)
                else
                    resolve(rows)
            })
        })
    },

    checkIfUserExists: (userId) => {
        return new Promise((resolve, reject) => {
            const sql =`SELECT * FROM user WHERE twitter_user_id = ? LIMIT 1`
            conn.query(sql, [userId], (err, rows) => {
                if (err)
                    reject(err)
                else
                    resolve(rows)
            })
        })
    }
}