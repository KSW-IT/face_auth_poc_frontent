layui.define((exports)=> {
    const {layer} = layui;
    

    const testMsg= {
        printTestMsg(){
            layer.msg('Hi, this is testing', {icon: 6});
        }
    }

    exports('testMsg', testMsg);
});