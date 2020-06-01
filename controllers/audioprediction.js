
const path = require('path');
const fs = require('fs');
const {spawn} = require('child_process');
const multer  = require('multer')
const upload = multer(); 
const {PythonShell} = require('python-shell') ;

module.exports = function(_,formidable){

    return {
        SetRouting: function(router){
        
            router.post('/pred', upload.single('file_name'), this.pred);

        },
        
         

        pred: function(req, res) {
       
        
          
              
          let filepath=path.join(__dirname,'../public/files/')
             

          let uploadLocation = filepath + req.file.originalname
          fs.writeFileSync(uploadLocation, Buffer.from(new Uint8Array(req.file.buffer))); 
          console.log(req.file.originalname)
          
      

        
          
          let options = {
            mode: 'text',
           
            pythonOptions: ['-u'], // get print results in real-time
            scriptPath: __dirname,
            args: [req.file.originalname]
          
          };
           
          PythonShell.run('audioPred.py', options, function (err, results) {
            if (err) throw err;
            // results is an array consisting of messages collected during execution
            console.log('results: %j', results[0]);
            res.send(results)
          });


       



    },
    
      







    }

}
