// 链接数据库
const mysql = require('mysql');

let connecttion = mysql.createConnection({
    user:'root',
    host:'localhost',
    port:'3306',
    password:'root',
    database:'koalist'
})

connecttion.connect((error)=>{
    if(error){
        console.log('链接失败');
    }else{
        console.log('链接成功');
    }
})

module.exports = connecttion;