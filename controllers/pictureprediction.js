const path = require('path');
const fs = require('fs');
const {spawn} = require('child_process');
const {PythonShell} = require('python-shell') ;

module.exports = function(_,formidable){

    return {
        SetRouting: function(router){
            router.post('/pictureprediction', this.pred);
            router.get('/pictureprediction', this.Page);
           
        },



        Page: function(req, res){
    
          return res.render('picture');
      },
   
        pred: function(req, res) {
          console.log("in predict function");
        
            const form = new formidable.IncomingForm();
            form.uploadDir = path.join(__dirname,'../public/files');

            form.on('file',(field, file) => {
              fs.rename(file.path, path.join(form.uploadDir, file.name), (err) => {
                console.log("renamed");
                console.log(file.name);
              if(err,res) {  console.log(err);
              //return res.render('error');}
             
              

              let options = {
                mode: 'text',
                pythonOptions: ['-u'], // get print results in real-time
                scriptPath: __dirname,
                args: [file.name]
             
              };
               
              PythonShell.run('/image_emotion_gender.py', options, function (err, results) {
                console.log("python");
                if(err,res) {return res.render('error');}
                // results is an array consisting of messages collected during execution
                console.log('results: %j', results);
                res.render('picture', { data: results,file:  file.name  });
                // res.send(results)

              });




            })
          })

            form.on('error', (err,res) => {
              console.log("form error");
              //return res.render('error');
              
              
            });

            form.on('end', () => {
              console.log("success");

            });

            form.parse(req);

            


    }







    }

}
