const fs = require("fs");
const path = require("path");

function patchFile(filePath, target, replacement) {
  const fullPath = path.resolve(__dirname, "..", filePath);
  if (!fs.existsSync(fullPath)) return;
  let content = fs.readFileSync(fullPath, "utf8");
  if (content.includes(replacement)) {
    return;
  }
  if (!content.includes(target)) {
    return;
  }
  content = content.replace(target, replacement);
  fs.writeFileSync(fullPath, content, "utf8");
  console.log(`[patch] Applied MariaDB compatibility patch to ${filePath}`);
}

patchFile(
  "node_modules/prisma/build/studio.js",
  "{columns:p,name:w,schema:v}=c,x=p.sort((k,N)=>k.position-N.position)",
  "{columns:p,name:w,schema:v}=c;if(typeof p===\"string\"){try{p=JSON.parse(p)}catch{}}let x=(Array.isArray(p)?p:[]).sort((k,N)=>k.position-N.position)"
);

patchFile(
  "node_modules/@prisma/studio-core/dist/data/mysql-core/index.cjs",
  "{columns:d,name:l,schema:u}=s,f=d.sort((c,N)=>c.position-N.position)",
  "{columns:d,name:l,schema:u}=s;if(typeof d===\"string\"){try{d=JSON.parse(d)}catch{}}let f=(Array.isArray(d)?d:[]).sort((c,N)=>c.position-N.position)"
);

patchFile(
  "node_modules/@prisma/studio-core/dist/data/mysql-core/index.js",
  "{columns:h,name:R,schema:a}=c,l=h.sort((t,u)=>t.position-u.position)",
  "{columns:h,name:R,schema:a}=c;if(typeof h===\"string\"){try{h=JSON.parse(h)}catch{}}let l=(Array.isArray(h)?h:[]).sort((t,u)=>t.position-u.position)"
);
