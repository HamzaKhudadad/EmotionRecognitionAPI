const path = require('path');
const fs = require('fs');
const {spawn} = require('child_process');
const {PythonShell} = require('python-shell') ;

module.exports = function(_,formidable){

    return {
        SetRouting: function(router){
            router.post('/picpred', this.pred);
            

        },




   
        pred: function(req, res) {
        
            const form = new formidable.IncomingForm();
            form.uploadDir = path.join(__dirname,'../public/files');

            form.on('file',(field, file) => {
              fs.rename(file.path, path.join(form.uploadDir, file.name), (err) => {
              if(err) throw err;
              console.log("renamed");
              console.log( file.name);
              

              let options = {
                mode: 'text',
               
                pythonOptions: ['-u'], // get print results in real-time
                scriptPath: __dirname,
                args: [file.name]
             
              };
               
              PythonShell.run('/image_emotion_gender.py', options, function (err, results) {
                if (err) throw err;
                // results is an array consisting of messages collected during execution
                console.log('results: %j', results);
                res.send(results)

              });




            })
          })

            form.on('error', (err) => {
              console.log("error");
            });

            form.on('end', () => {
              console.log("success");

            });

            form.parse(req);

            


    }







    }

}
