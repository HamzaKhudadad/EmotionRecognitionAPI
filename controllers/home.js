
module.exports = function(_,formidable){

    return {
        SetRouting: function(router){
            router.get('/', this.indexPage);
            

        },

        indexPage: function(req, res){
    
            return res.render('index');
        },

}
}
