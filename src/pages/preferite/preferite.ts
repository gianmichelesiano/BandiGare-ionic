import { Component } from '@angular/core';
import { NavController, NavParams,  LoadingController } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { DettagliPage } from '../dettagli/dettagli'
import { PreferenzePage } from '../preferenze/preferenze'

import { AngularFire, FirebaseObjectObservable } from 'angularfire2';
import { User } from '@ionic/cloud-angular';

import firebase from 'firebase';

@Component({
  selector: 'page-preferite',
  templateUrl: '../template-gare/template-gare.html'
})
export class PreferitePage {

  public gare = [];
  public gareFiltrate = [];
  public gareRicercate = [];
  public categoriePreferite :any;
  private titolo: string
  public uid: any;


  preferenzeSnap: FirebaseObjectObservable<any>;
  locVar:any;
  numGareInfinite : number = 10;
  visible : boolean = false;
  importanti : boolean = false;
  preferite : boolean = false;

  constructor(public navCtrl: NavController, public navParams: NavParams, storage: Storage, public user:User, private af: AngularFire, public loadingCtrl:LoadingController) {
    this.titolo = "Preferite";
    this.uid = firebase.auth().currentUser.uid;
    storage.get('gareDB').then((val) => {
      for (var key in val) {    
            this.gare.push({key: key, value: val[key]});
      }

   	  this.preferenzeSnap = this.af.database.object('/utenti/'+this.uid+'/preferenze/', { preserveSnapshot: true });
	    let loader = this.loadingCtrl.create({
	    content: "Sto caricando le preferenze..."
	  });
	  loader.present();
	  let preferenzaCategoria = [];
  	  let preferenzaProvincia = [];
      this.preferenzeSnap.subscribe(snapshot => {

	    		this.locVar = snapshot.val();
	    		if (this.locVar ==null) {
	    			preferenzaCategoria = [];
	    			preferenzaProvincia = [];

	    		} else {
	    			preferenzaCategoria = this.locVar['categoria'];
	    			preferenzaProvincia = this.locVar['provincia'];

	  			} 
	  			loader.dismissAll();
				for (let i=0; i<preferenzaCategoria.length; i++) {
					for (let j=0; j<preferenzaProvincia.length; j++) { 
						let gareTemp = []

            if (preferenzaCategoria[i].length == 2){

              gareTemp = this.gare.filter( function (el) { 
                return el['value']['PROVINCIA'] == preferenzaProvincia[j] && el['value']['CPV'].substring(0, 2)== preferenzaCategoria[i]
              });
            } else {
              gareTemp = this.gare.filter( function (el) { 
                return el['value']['PROVINCIA'] == preferenzaProvincia[j] && el['value']['CATEGORIA_PREVALENTE']== preferenzaCategoria[i]
              });
            }
    					this.gareRicercate = this.gareRicercate.concat(gareTemp);
					}
				}

          if (this.gareRicercate.length<=this.numGareInfinite &&  this.gareRicercate.length>0){
            this.numGareInfinite = this.gareRicercate.length
            this.visible = true;
          } else {
            this.numGareInfinite = 0
            this.preferite = true;
          }
          for (let i = 0; i < this.numGareInfinite; i++) {
      				 this.gareFiltrate.push( this.gareRicercate[i]);
    			}
	    });
    })  
  }


  impostaPref(){
    this.navCtrl.push( PreferenzePage )
  }

  apriDettaglio(gara){
    this.navCtrl.push( DettagliPage, {
      gara:gara
    });
  }


  loadMore(infiniteScroll) {
    console.log('Begin async operation');
    let lung = this.gareFiltrate.length
    if (lung < this.gareRicercate.length){
    	if (this.gareRicercate.length-lung<this.numGareInfinite  ){

    		this.numGareInfinite = this.gareRicercate.length-lung
	    	for (let i = lung; i < lung + this.numGareInfinite; i++) {
		        this.gareFiltrate.push( this.gareRicercate[i] );
		    }
		    this.visible = true;
		    infiniteScroll.enable(false);

    	}
  
	    setTimeout(() => {
	      for (let i = lung; i < lung + this.numGareInfinite; i++) {
	        this.gareFiltrate.push( this.gareRicercate[i] );
	      }

	      console.log('Async operation has ended');
	      infiniteScroll.complete();
	    }, 500);
	}
  //infiniteScroll.enable(false);
  }


}
 