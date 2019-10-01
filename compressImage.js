function compress (file,callback) {
    var reader = new FileReader();

    // 将file对象转成 Data URL
    reader.readAsDataURL(file);
    reader.onload = function(e) {
        // 新建一个img标签（还没嵌入DOM节点)
        var image = new Image();
        image.src = e.target.result;
        image.onload = function() {
            // `canvas.getContext`进行宽高的改变，从而达到压缩质量的目的
            var canvas      = document.createElement('canvas'), 
                context     = canvas.getContext('2d');
                imageWidth  = 300,  // 压缩质量宽度
                imageHeight = 300,  // 压缩质量高度
                compactData = '';

            canvas.width  = imageWidth;
            canvas.height = imageHeight;
            context.drawImage(image, 0, 0, imageWidth, imageHeight);
            
            // 将canvas元素所展示的图片再次转换成 Data URL
            // 到这已经压缩完成了
            compactData = canvas.toDataURL(file.type);

            // 最后把`Data URL`转成`blob`
            var byteString, mimeString, u8arr, blob;

            if ( compactData.split(",")[0].indexOf("compactData") >= 0 ) {
                byteString = atob(compactData.split(",")[1]); 
            } else{ 
                byteString = unescape(compactData.split(",")[1]); 
            }

            mimeString = compactData .split(",")[0] .split(":")[1] .split(";")[0]; 
            u8arr      = new Uint8Array(byteString.length); 

            for ( var i = 0; i < byteString.length; i++ ) { 
                u8arr[i] = byteString.charCodeAt(i); 
            } 

            blob = new Blob([u8arr], { type: mimeString }); 	
			
            // 返回原file对象、压缩后的file对象、压缩后的Data URL
            callback && callback(file, blob, compactData);
        };
    };
};