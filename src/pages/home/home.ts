import { Component, ViewChild } from '@angular/core';
import { NativeStorage } from 'ionic-native';
import { NavController } from 'ionic-angular';
import {Validators, FormBuilder, FormGroup } from '@angular/forms';
declare var Peer:any;
declare var webkitGetUserMedia:any;
@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  //call function
  public todo : FormGroup;
  public SERVER_IP = '10.10.11.96'
  public SERVER_PORT= 9000;
  public Localvideo:any;
  public remotevideo:any;
  public callerId:any;
  public peer: any = null;
  public test:any;
  public getUserMedia:any = navigator.getUserMedia;
  
  public localStream:any = null;

  constructor(public navCtrl: NavController,public formBuilder: FormBuilder) {
   this.todo = this.formBuilder.group({
      phone: ['', Validators.required],
    });

    
    }

    // getLocalStream(successCb) {
    //     NativeStorage.getItem('localStream').then(data => {
    //         successCb(data);
    //     }, err => {
    //         alert("Error in getting localStream " + JSON.stringify(err))
    //         navigator.getUserMedia({ audio: true, video: true }, function(stream) {
    //             NativeStorage.setItem('localStream', window.URL.createObjectURL(stream)).then(() => {
    //                 alert('set localStream success ' + window.URL.createObjectURL(stream))
    //             }, err => {
    //                 alert('set localStream err ' + JSON.stringify(err))
    //             })
    //         }, function(err) {
    //             alert('Failed to access local camera ' + JSON.stringify(err))
    //         })
    //     })
    // }

    // showRemoteStream(stream) {
    //     alert('showRemoteStream success ' + window.URL.createObjectURL(stream))
    // }

    connect() {
        if (!this.callerId) {
            alert('Please enter your name first')
            this.setCallerId();
            return;
        }

        try {
            console.log('create connection to the ID server');
            console.log('host: ' + this.SERVER_IP + ', port: ' + this.SERVER_PORT);
            this.peer = new Peer(this.callerId, {
                host: this.SERVER_IP,
                port: this.SERVER_PORT
            });

            this.peer.socket._socket.onclose = function() {
                alert('No connection to server');
                this.peer = null;
            };

            this.peer.socket._socket.onopen = function() {
                alert('Connection to the server is opened')
            };

            this.peer.on('call', this.answer);
        } catch(e) {
            this.peer = null;
            alert('Error while connecting to the server')
        }
    }
    

    dial() {
        if (!this.peer) {
            alert('Please connect first')
            return;
        }

        // if (!this.localStream) {
        //     alert('Could not start a call there is no local camera')
        //     return;
        // }

        var receiptientId = prompt('Please enter receiptient name')

        if (!receiptientId) {
            alert('Could not start a call as no receiptientId is set')
            this.dial();
            return;
        }

        if (this.getUserMedia) {
            navigator.getUserMedia({ audio: true, video: true }, function(stream) {
                alert('Outgoing call initiated');
                NativeStorage.getItem('peer').then(data => {
                    var call = data.call(receiptientId, stream);
                    call.on('stream', function(stream) {
                        alert('remote stream ' + window.URL.createObjectURL(stream))
                    });
                    call.on('error', function(e) {
                        alert('Error with call');
                        console.log(e.message);
                    });
                }, err => {
                    alert('get peer failed')
                })
                
            }, function(error) {
                alert('get user media failed')
            })
        } else {
            alert('No local camera')
        }
    }

    setCallerId() {
        this.callerId = prompt('Please enter your name');
        this.connect();
    }

    answer(call) {
        if (!this.peer) {
            alert('Cannot answer a call without a connection')
            return;
        }

        if (this.getUserMedia) {
            navigator.getUserMedia({ audio: true, video: true }, function(stream) {
                alert('Incoming call answered');
                call.on('stream', function(stream){
                    alert('remote stream ' + window.URL.createObjectURL(stream))
                });
                call.answer(stream);
            }, function(error) {
                alert('get user media error')
            })
        } else {
            alert('No local camera');
            return;
        }
    }

 
   
// ionViewDidLoad(){
//       console.log("The value of the callerID"+this.callerId)
    
//    try {
//             // create connection to the ID server
//             console.log('create connection to the ID server');
//             console.log('host: ' + this.SERVER_IP + ', port: ' + this.SERVER_PORT);
//             console.log("The value of the test callerId"+this.callerId);
//             this.peer = new Peer(this.callerId, {
                
//                 host: this.SERVER_IP,
//                 port: this.SERVER_PORT
//             });
//             console.log("Error code ")

//             // hack to get around the fact that if a server connection cannot
//             // be established, the peer and its socket property both still have
//             // open === true; instead, listen to the wrapped WebSocket
//             // and show an error if its readyState becomes CLOSED
//             this.peer.socket._socket.onclose = function() {
//                 alert('No connection to server');
//                 this.peer = null;
//             };

//             // get local stream ready for incoming calls once the wrapped
//             // WebSocket is open
//             this.peer.socket._socket.onopen = function() {
//                 // this.getLocalStream(function() {
//                 //     this.callButton.style.display = 'block';
//                 // });
//             };

//             // handle events representing incoming calls
//             //this.peer.on('call', this.answer);
//         } catch (e) {
//             this.peer = null;
//             alert('Error while connecting to server test'+JSON.stringify(e));
//         }
     

          
  
    
// }

// getLocationStream(successCb){
//     var localStream = this.localStream;
//     if(localStream && successCb){
//         successCb(this.localStream)

//     }else{
//         navigator.getUserMedia({
//             audio: true,
//             video: true
//         }, function(stream){
            
          
//         },function(err){
//             alert("Error messages"+err);

//         })
//     }
    
// }

// Call(){
//     if(!this.todo.valid){
//         console.log("The User input the invalie value"+this.todo.value.phone);
//     }
//     else{
//         if (!this.peer) {
//             alert('Please connect first');
//             return;
//         }

//         if (!this.localStream) {
//             alert('Could not start call as there is no local camera');
//             return
//         }

        

        

//         this.getLocalStream(function(stream) {
//             console.log('Outgoing call initiated');

//             var call = this.peer.call(this.todo.value.phone, stream);

//             call.on('stream', this.showRemoteStream);

//             call.on('error', function(e) {
//                 alert('Error with call');
//                 console.log(e.message);
//             });
//         });
//     };

    // answer an incoming call
//     var answer = function(call) {
//         if (!this.peer) {
//             alert('Cannot answer a call without a connection');
//             return;
//         }

//         if (!this.localStream) {
//             alert('Could not answer call as there is no localStream ready');
//             return;
//         }

//         console.log('Incoming call answered');

//         call.on('stream', this.showRemoteStream);

//         call.answer(this.localStream);

//     }
    


// }

// answer(){
//      if (!this.peer) {
//             alert('Cannot answer a call without a connection');
//             return;
//         }

//         if (!this.localStream) {
//             alert('Could not answer call as there is no localStream ready');
//             return;
//         }

//         console.log('Incoming call answered');

//         this.call.on('stream', this.showRemoteStream);

//         this.call.answer(this.localStream);

// }
  }

 
  



  


