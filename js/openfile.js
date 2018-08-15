function readDataFile(dataFile){
    let readFn;
    /* if(dataFile.name.endsWith(".json")){
        readFn = loadJSONFile;
    } else*/ if(dataFile.name.endsWith(".nimn")){
        readFn = loadProjectFile;
    } else if(dataFile.name.endsWith(".fpp")){
        readFn = loadFpp;
    } else if(dataFile.name.endsWith(".xml")){
        readFn = loadPascalXML;
    } else {
        console.log(`Ignoring file ${dataFile.name}`);
        return;
    }

    const reader = new FileReader();
    reader.onload = function (e) {
        readFn(e.target.result);
    };
    reader.readAsText(dataFile, 'ISO-8859-1');
}

var loadProjectFile = function(data){
    labellingData = nimn.parse(nimnSchema, data);
    //labellingData =  JSON.parse(data);
}
var loadDlibXml = function(data){
    var obj = parser.parse(data,{
        ignoreAttributes : false,
        attributeNamePrefix : "",
    });

    //labellingData = {};
    var image = obj.dataset.images.image;

    if(!Array.isArray(image)){
        image = [image];
    }

    for(var index=0; index < image.length; index++){//for each image
        var pathArr = image[index].file.split(/\\|\//);
        var imgName = pathArr[ pathArr.length -1 ];
        var boxes = image[ index ].box;
        var boxObject = [];
        if(boxes){
            if(!Array.isArray(boxes)){
                boxes = [boxes];
            }
            for(var b_index =0; b_index < boxes.length; b_index++){//for each box
                var currentBox = boxes[ b_index ];

                boxObject .push({
                    id : "rect" + b_index,
                    label: currentBox.label,
                    type: "rect",
                    bbox : {
                        x: currentBox.left,
                        y: currentBox.top,
                        h: currentBox.height,
                        w: currentBox.width,
                        /* ignore: currentBox.ignore */
                        /* pose='4' detection_score='4' */
                    },
                    points : [
                        currentBox.left,
                        currentBox.top,
                        currentBox.width,
                        currentBox.height
                    ],
                    attributes : [],
                    featurePoints: []
                })
                if(currentBox.part){
                    if(!Array.isArray(currentBox.part)){
                        currentBox.part = [currentBox.part];
                    }

                    for(var p_index=0; p_index< currentBox.part.length; p_index++){//for each part
                        var pointlabel = currentBox.part[p_index].name || p_index+1;

                        boxObject[b_index].featurePoints.push({
                            id: "point" + p_index,
                            x: currentBox.part[p_index].x/*  - currentBox.left */,
                            y: currentBox.part[p_index].y/*  - currentBox.top */,
                            label: pointlabel
                        })
                    }//End - for each part
                }
            }//End - for each box
        }

        if(labellingData[imgName]){
            labellingData[imgName].shapes =  boxObject;
        }
    }//End - for each image

}

function loadPascalXML(data) {
    annot = JXON.stringToJs(data).annotation;
    imgData = initImgInStore(annot.filename, annot.size);
    if (imgData === null) {
        console.log(`Image already initialised: ${annot.filename}`);
        return;
    }
    for (let [idx, obj] of annot.object.entries()) {
        const x = obj.bndbox.xmin,
              y = obj.bndbox.ymin,
              w = obj.bndbox.xmax - obj.bndbox.xmin,
              h = obj.bndbox.ymax - obj.bndbox.ymin;
        const bbox = [x, y, w, h];

        // copied from `attachShapeToImg`; TODO: use the same function without global state
        imgData.shapes.push( {
            "id" : `loaded-shape-${idx}`,
            "category": obj.name,
            "corpus": obj.corpus,
            "label" : obj.transcription,
            "type" : 'rect',
            "points": bbox,
            "bbox" : bbox,
            "attributes": [],
            "tags": [],
            "featurePoints": [],
        } );
    }
}
