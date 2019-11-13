const Koa = require('koa');

const app = new Koa();

// 处理静态资源
const static = require('koa-static');

// 处理前端post请求
const bodyparser = require('koa-bodyparser');

// 路由
const router = require('koa-router')();

const path = require('path');

const query = require('./db/query')

app.use(static(path.join(process.cwd(),'pulice')));

app.use(bodyparser());

app.use(router.routes());

app.use(router.allowedMethods());

// 查找
router.get('/api/banner',async ctx=>{
    let data = await query('select * from banner')
    ctx.body = data
})



//增加
router.post('/api/add',async ctx => {
    let {noteId,sorting,linklink} = ctx.request.body;
    console.log(ctx.request.body)
    //做容错处理
    if(noteId && sorting && linklink){
        //  查此数据存在不存在
        let user = await query('select * from banner where sorting=?',[sorting]);

        if(user.data.length){
            //  存在
            ctx.body = {
                code:0,
                msg:'此数据已存在'
            }
        }else{
            // 不存在  添加
            try{
                await query('insert into banner (noteId,sorting,linklink) values (?,?,?)',[noteId,sorting,linklink]);
                ctx.body = {
                    code:1,
                    msg:'添加成功'
                }
            }catch(e){
                ctx.body = {
                    code:0,
                    msg:e.error
                }
            }
            
        }
    }else{
        ctx.body = {
            code:2,
            msg:'参数缺少'
        }
    }
})

//修改
router.post('/api/gai',async ctx=>{
    let {noteId,sorting,linklink,id} = ctx.request.body;

    if(noteId && sorting && linklink && id){
        try{
           await query('update banner set noteId=?,sorting=?,linklink=? where id=?',[noteId,sorting,linklink,id]);
           ctx.body = {
               code:1,
               msg:"修改成功"
           }
        }catch(e){
            ctx.body = {
                code:0,
                msg:e.error
            }
        }
    }
})

// 删除
router.get('/api/del',async ctx=>{
    let {id} = ctx.query;
    if(id || id == 0){
        try{
            await query('delete from banner where id=?',[id]);
            ctx.body = {
                code:1,
                msg:'删除成功'
            }
        }catch(e){
            ctx.body = {
                code:0,
                msg:e.error
            }
        }
    }
    
})




app.listen(process.env.PORT || 3000 , ()=>{
    console.log("服务启动成功")
})