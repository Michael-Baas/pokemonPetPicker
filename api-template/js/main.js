//Example fetch using pokemonapi.co
document.querySelector('button').addEventListener('click', getFetch)

function getFetch(){
  const choice = document.querySelector('input').value.replaceAll(' ', '-').replaceAll('.','').toLowerCase()
  console.log(choice)
  const url = `https://pokeapi.co/api/v2/pokemon/${choice}`

  fetch(url)
    .then(res => res.json()) // parse response as JSON
    .then(data => {
      console.log(data)
      const potentialPet = new PokeInfo(data.name, data.height, data.weight, data.types, data.sprites.other['official-artwork'].front_default, data.location_area_encounters)
      potentialPet.getTypes()
      potentialPet.isItHousePet()
      potentialPet.encounterInfo()
      let decision = '';
      if(potentialPet.housePet){
        decision = 'This Pokemon is small enough, light enough, and safe enough to be a good pet!'
      } else{
        decision = `This Pokemon wouldn't be a good pet because ${potentialPet.reason.join(' and ')}.`
      }
      document.querySelector('h2').innerText = decision;
      document.querySelector('img').src = potentialPet.image;
    })
    .catch(err => {
      console.log(`error ${err}`)
    });
}

class Poke {
  constructor(name, height, weight, types, image){
    this.name = name;
    this.height = height;
    this.types = types;
    this.image = image;
    this.weight = weight; // this is returned as decimeters 10cm = 1 decimeter or divide by 3.048 to convert to feet
    this.housePet = true;
    this.reason = [];
    this.typeList = [];
  }
  getTypes(){
    for (const property of this.types){
      this.typeList.push(property.type.name)
    }
    console.log(this.typeList)
  }
  weightToPounds(weight){
    return Math.round((weight/4.536)*100)/100
  }

  heightToFeet(height){
    return Math.round((height/3.048)*100)/100
  }

  isItHousePet(){
    // check height, weight & types
    let badTypes = ['fire', 'electric', 'fighting', 'poison', 'ghost']
    if (this.weightToPounds(this.weight) > 400){
      this.reason.push(`it is too heavy at ${this.weightToPounds(this.weight)} pounds`);
      this.housePet = false;
    }
    if(this.heightToFeet(this.height) > 7 ){
      this.reason.push(`it is too tall at ${this.heightToFeet(this.height)} feet`)
      this.housePet = false;
    }
    if(badTypes.some(r => this.typeList.indexOf(r) >= 0)){
      this.reason.push(`it's type is too dangerous`)
      this.housePet = false;
    }
    console.log(this.reason, this.weightToPounds(this.weight), this.heightToFeet(this.height))
  }
}

class PokeInfo extends Poke {
  constructor(name,height,width,types,image,location){
    super(name,height,width,types,image)
    this.locationURL = location;
    this.locationList = [];
    this.locationString = '';
    }

    encounterInfo(){
      fetch(this.locationURL)
        .then(res => res.json())
        .then(data => {
          console.log(data)
        })
        .catch(err => {
          console.log(`error ${err}`)
        });
    }
  
}
