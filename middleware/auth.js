const jwt=require('jsonwebtoken');
function requireAuth(req,res,next){const t=req.cookies?.globalnews_token;if(!t)return res.status(401).json({error:'Authentication required'});try{req.user=jwt.verify(t,process.env.JWT_SECRET);next()}catch{return res.status(401).json({error:'Invalid or expired session'})}}
function requireRole(...roles){return(req,res,next)=>{if(!req.user||!roles.includes(req.user.role))return res.status(403).json({error:'Insufficient permissions'});next()}}
module.exports={requireAuth,requireRole};
