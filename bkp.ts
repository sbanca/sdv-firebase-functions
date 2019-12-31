import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';

admin.initializeApp({});
  
// Start writing Firebase Functions
// https://firebase.google.com/docs/functions/typescript

// To test locally  https://firebase.google.com/docs/functions/local-emulator
// $ set GOOGLE_APPLICATION_CREDENTIALS=C:\Users\Riccardo\Documents\GitHub\sdv-firebase-functions\gltf-storage-da46ee6877a0.json
// $ firebase emulators:start

// TO Build 
// Ctrl+Shift+B

// To Deploy 
// firebase deploy --only functions


export const gltflist = functions.region('europe-west2').https.onRequest((request, response) => {

    const fileURLs: any[]  = []; 
    
    // get all files START

    admin.storage().bucket().getFiles()  
    .then(FileList => {
        
        // iterate all files START

        const allFilesIteration = new Promise((resolve, reject) => {
            FileList[0].forEach((file, index, array) => {
                
                // get signed url promise START

                file.getSignedUrl({ action: 'read', expires: '03-17-2025' })

                .then( fileURL=> {
                    fileURLs.push(fileURL[0]);
                    console.log(fileURLs);
                    if (index === FileList[0].length -1) resolve(fileURLs);
                })

                .catch(error => {
                    fileURLs.push(error);
                    if (index === FileList[0].length -1) resolve(fileURLs);
                    response.send('getSignedUrl error => ' + error);
                })

                // get signed url promise END  

            });
        });
        
        allFilesIteration.then((fileURLs)=>{
            console.log('then');
            response.send(fileURLs);
            });

        // iterate all files END

    })
    
    .catch(error =>{
        console.log(error);
        response.send('getfile error => ' + error);
    }) 

    // get all files END

});



