import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';

admin.initializeApp({});
  
// Start writing Firebase Functions
// https://firebase.google.com/docs/functions/typescript
// to test locally 
// $ set GOOGLE_APPLICATION_CREDENTIALS=C:\Users\Riccardo\Documents\GitHub\sdv-firebase-functions\gltf-storage-da46ee6877a0.json
// $ firebase emulators:start
// TO Build 
// Ctrl+Shift+B
// To Deploy 
// firebase deploy --only functions


export const fileList = functions.region('europe-west2').https.onRequest((request, response) => {

    console.log(request.query);

    const fileList: any[]  = [];

    admin.storage().bucket('gs://gltf-storage.appspot.com').getFiles()
       .then(FileList => {

        var promise = new Promise((resolve, reject) => {
            
            FileList[0].forEach((file, index, array) => {

                    fileList.push(file.metadata.name);
                    if (index === FileList[0].length -1) resolve(fileList);

                });          

            });

        promise.then( (fileList) => response.send(fileList) );
        
    })

    .catch(error =>{
        console.log(error);
        response.send(error);
    }) 
      

});

export const fileUrl = functions.region('europe-west2').https.onRequest((request, response) => {

    console.log(request.query.filename);
    
    const File = admin.storage().bucket('gs://gltf-storage.appspot.com').file(request.query.filename)
    
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);

    File.getSignedUrl({ action: 'read', expires: tomorrow })
    .then( fileURL =>  response.send(fileURL) )
    .catch( error =>  response.send(error) )

});


