const MessageSchema = require('../models/Message')


function AutoDeleteMessage() {
    this.hash = {}

    this.add = function (chatRoom, messageId, duration) {
        let tempt = setTimeout(async () => {
            // console.log(chatRoom, duration, messageId)
            const deletedMess = await MessageSchema.deleteMessageById(messageId)
            if(deletedMess){
                global.io.to(String(chatRoom)).emit('test-global', messageId)
            }
            this.hash[chatRoom].shift()
        }, duration)
        if (this.hash[chatRoom] === undefined) {
            this.hash[chatRoom] = [tempt]
        } else {
            this.hash[chatRoom].push(tempt)
        }
    }

    this.print = function () {
        console.log(this.hash)
        return this.hash
    }
}


module.exports = new AutoDeleteMessage()