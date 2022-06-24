const http = require('http');
const url = require('url');
const fs = require('fs');

//SERVER

const replaceTemplate = (temp,product) =>{
    let output = temp.replace(/{%name%}/g,product.name);
    output = output.replace(/{%account%}/g,product.account);
    output = output.replace(/{%contact%}/g,product.contact);
    output = output.replace(/{%position%}/g,product.position);
    output = output.replace(/{%contactinfo%}/g,product.contact_info.phone);
    output = output.replace(/{%detail%}/g,product.contact_details);
    output = output.replace(/{%date%}/g,product.date);
    output = output.replace(/{%id%}/g,product.id);
    return output;
}
const data = fs.readFileSync('data.json','utf-8');
const temp = fs.readFileSync('salesinfo.html','utf-8');
const table = fs.readFileSync('table.html','utf-8');
const productPage = fs.readFileSync('product.html','utf-8');
const salesData = JSON.parse(data);

const server = http.createServer((req,res) =>{

  const {query,pathname} = url.parse(req.url,true);
    if(pathname === '/' || pathname === '/overview'){

        
        const tableHtml = salesData.map(el => replaceTemplate(temp,el)).join('')

        res.writeHead(200,{
            'Content-type':'text/html'
        })
        res.end(tableHtml)
    }else if(pathname === '/product'){
        res.writeHead(200,{'Content-type':'text/html'})
        const stuff = salesData[query.id];
        const output = replaceTemplate(productPage,stuff);
        res.end(output)
    }else if(pathname === '/api'){
      res.writeHead(200,{
        'Content-type':'application/json'
      })
      res.end(data);
        
    }else
    {
        res.writeHead(404,{
            'Content-type': 'text/html',
            'my-own-header': 'My custom header'

        });
        res.end('<h1>Page not found</h1>');
    }
    // res.end('Hello from the server');
})
//Port the server is listening 
server.listen(8000,'127.0.0.1',()=>{
    console.log("Listening to request on port 8000");
});