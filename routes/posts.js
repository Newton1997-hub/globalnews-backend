const express=require('express'),slugify=require('slugify'),db=require('../db'),{requireAuth}=require('../middleware/auth');const r=express.Router();const q=`SELECT p.*,c.name category_name,u.name author_name FROM posts p LEFT JOIN categories c ON c.id=p.category_id LEFT JOIN users u ON u.id=p.author_id`;
r.get('/',requireAuth,(req,res)=>{const term=String(req.query.q||'').trim();const rows=term?db.prepare(q+' WHERE p.title LIKE ? ORDER BY p.created_at DESC').all('%'+term+'%'):db.prepare(q+' ORDER BY p.created_at DESC').all();res.json(rows)});
r.post('/',requireAuth,(req,res)=>{const{title,excerpt='',content,category_id=null,status='draft',featured=0,trending=0,cover_image=''}=req.body;if(!title||!content)return res.status(400).json({error:'Title and content are required'});const slug=slugify(title,{lower:true,strict:true})+'-'+Date.now().toString(36);const pub=status==='published'?new Date().toISOString():null;const x=db.prepare('INSERT INTO posts(title,slug,excerpt,content,cover_image,category_id,author_id,status,featured,trending,published_at) VALUES(?,?,?,?,?,?,?,?,?,?,?)').run(title,slug,excerpt,content,cover_image,category_id,req.user.id,status,featured?1:0,trending?1:0,pub);res.status(201).json(db.prepare(q+' WHERE p.id=?').get(x.lastInsertRowid))});
r.put('/:id',requireAuth,(req,res)=>{const old=db.prepare('SELECT * FROM posts WHERE id=?').get(req.params.id);if(!old)return res.status(404).json({error:'Post not found'});const d={...old,...req.body},pub=d.status==='published'?(old.published_at||new Date().toISOString()):null;db.prepare('UPDATE posts SET title=?,excerpt=?,content=?,cover_image=?,category_id=?,status=?,featured=?,trending=?,published_at=?,updated_at=CURRENT_TIMESTAMP WHERE id=?').run(d.title,d.excerpt,d.content,d.cover_image,d.category_id,d.status,d.featured?1:0,d.trending?1:0,pub,req.params.id);res.json(db.prepare(q+' WHERE p.id=?').get(req.params.id))});r.delete('/:id',requireAuth,(req,res)=>{
    db.prepare('DELETE FROM posts WHERE id=?').run(req.params.id);
    res.json({ok:true})
});

r.post('/:id/view',(req,res)=>{
    const post=db.prepare(
        "SELECT id,status FROM posts WHERE id=?"
    ).get(req.params.id);

    if(!post){
        return res.status(404).json({
            error:'Post not found'
        });
    }

    if(post.status!=='published'){
        return res.status(403).json({
            error:'Post is not published'
        });
    }

    db.prepare(
        'UPDATE posts SET views=COALESCE(views,0)+1 WHERE id=?'
    ).run(req.params.id);

    const updated=db.prepare(
        'SELECT id,views FROM posts WHERE id=?'
    ).get(req.params.id);

    res.json(updated);
});

module.exports=r;