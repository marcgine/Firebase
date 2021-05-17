var firebaseConfig = {
    apiKey: "AIzaSyDr2RGvEN-AFBdEXEkNe0qbeGEJfi-Y0Mo",
    authDomain: "fir-76d70.firebaseapp.com",
    projectId: "fir-76d70",
    storageBucket: "fir-76d70.appspot.com",
    messagingSenderId: "728774843679",
    appId: "1:728774843679:web:771a0f32c11e02f226242a"
};
firebase.initializeApp(firebaseConfig);

const db = firebase.firestore();
db.collection('recipes');

const list = document.querySelector('ul');
const form = document.querySelector('form');
const unsubscribeBtn = document.querySelector('.unsubscribe');

const addRecipe = (recipe, id) => {
   let dataGuardada = recipe.created_at.toDate();
   let diaData = dataGuardada.getDate();
   let mesData = dataGuardada.getMonth() + 1;
   let anyData = dataGuardada.getFullYear();
   diaData = (diaData < 10) ? "0" + diaData : diaData;
   mesData = (mesData < 10) ? "0" + mesData : mesData;
   let dataAMostrar = diaData + "/"
      + mesData + "/"
      + anyData;

   let html = `
         <li data-id="${id}">
            <div><b>${recipe.title}</b> (${dataAMostrar})</div>
            <div>${recipe.author}</div>
            <button class="btn btn-danger btn-sm my-2">delete</button>
        </li>
    `;

   list.innerHTML += html;
};

const deleteRecipe = id => {
   const recipes = document.querySelectorAll('li');
   recipes.forEach(recipe => {
      if (recipe.getAttribute('data-id') === id) {
         recipe.remove();
      }
   });
};
const unsubscribe = db.collection('recipes').onSnapshot(snapshot => {
   // console.log(snapshot.docChanges());
   snapshot.docChanges().forEach(change => {
      // console.log(change);
      const doc = change.doc;
      // console.log(doc);
      if (change.type === 'added') {
         addRecipe(doc.data(), doc.id);
      } else if (change.type === 'removed') {
         deleteRecipe(doc.id);
      }
   });
});
form.addEventListener('submit', e => {
   e.preventDefault();
   let now = new Date();

   const recipe = {
      title: form.recipe.value,
      author: "Joan",
      created_at: firebase.firestore.Timestamp.fromDate(now)
   };
   form.recipe.value = "";
   // form.formEntradaAutor.value = "";
   db.collection('recipes').add(recipe)
      .then(() => console.log('Recepta afegida!'))
      .catch(err => console.log(err))
});
list.addEventListener('click', e => {  
   if (e.target.tagName === 'BUTTON') {
      const id = e.target.parentElement.getAttribute('data-id');
      // console.log(id);
      db.collection('recipes').doc(id).delete()
         .then(() => console.log('recipe deleted!'))
         .catch((err) => console.log(err));
   }
});