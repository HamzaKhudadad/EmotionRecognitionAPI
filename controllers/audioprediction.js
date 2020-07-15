
const path = require('path');
const fs = require('fs');
const {spawn} = require('child_process');
const multer  = require('multer')
const upload = multer(); 
const {PythonShell} = require('python-shell') ;

module.exports = function(_,formidable){

    return {
        SetRouting: function(router){
        
            router.post('/audioprediction', this.pred);
            router.get('/audioprediction', this.Page);
        },
        
         
        Page: function(req, res){
    
          return res.render('audio');
      },




        pred: function(req, res) {
       
        
          
          const form = new formidable.IncomingForm();
          form.uploadDir = path.join(__dirname,'../public/files');

          form.on('file',(field, file) => {
            fs.rename(file.path, path.join(form.uploadDir, file.name), (err) => {
              if(err) {  console.log(err);}
         
            
            

            let options = {
              mode: 'text',
             
              pythonOptions: ['-u'], // get print results in real-time
              scriptPath: __dirname,
              args: [file.name]
           
            };
        
          
       
           
          PythonShell.run('audioPred.py', options, function (err, results) {
            if(err) {  console.log(err);}
            // results is an array consisting of messages collected during execution
            console.log('results: %j', results);
            res.render('audio', { data: results,file:  file.name  });
           // res.send(results)
          });


       
        })
      })

        form.on('error', (err) => {
          if(err) {  console.log(err);}
          
          
        });

        form.on('end', () => {
          console.log("success");

        });

        form.parse(req);

        



    },
    
      

  }





    }


