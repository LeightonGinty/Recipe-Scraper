
// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getDatabase, ref, set, child, get, onValue } from "firebase/database";
import cheerio  from 'cheerio';
import axios from 'axios';
import {RateLimit} from "async-sema";


// var request = require("request");
// const axios = require("axios");
var url = "https://www.birmingham.ac.uk/index.aspx"



// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDOdh4qTrp1jObHVE1xaI29BHJLsv9f-i0",
  authDomain: "recipes-a8e9d.firebaseapp.com",
  projectId: "recipes-a8e9d",
  storageBucket: "recipes-a8e9d.appspot.com",
  messagingSenderId: "1056264670242",
  appId: "1:1056264670242:web:4331c705f1eb13d3980e7b",
  measurementId: "G-6ZHPQK208Q",
  databaseURL: "https://recipes-a8e9d-default-rtdb.europe-west1.firebasedatabase.app/",
};

// Initialize Firebase
const firebaseApp = initializeApp(firebaseConfig);
// const analytics = getAnalytics(app);

// Initialize Realtime Database and get a reference to the service
const database = getDatabase(firebaseApp);
// var router = express();
// var ref = firebaseApp.database().ref();
var info = ""
const dbRef = ref(getDatabase());
get(child(dbRef, `recipes/`)).then((snapshot) => {
  if (snapshot.exists()) {
    // console.log(snapshot.val());
    info = snapshot.val();

  } else {
    console.log("No data available");
  }
}).catch((error) => {
  console.error(error);
});
// router.get("/", function (req, res) {

      let recipes = [];

//     request(url, function (err, response, html) {
    //   if (!err) {

      // .standard-card-new__article-title
      const limit = RateLimit(5);

      const req = async () => {
        const { html } = await axios.get(url);
        // console.log(html)
      }
      req()
      function finishedRecipes(){

      }

      function writeRecipe(_name, _ingredients, _url) {
        // console.log(_name);
        // const name = titleRecipe.replaceAll(' ', '');

        set(ref(database, 'recipes/' + _name), {
          name: _name,
          ingredients: _ingredients,
          url: _url
        });
        console.log("written");
      }

       (async function loadRecipes(callback) {
        let j = 1;
        for(let j = 0; j < 417; j++){
          //https://www.bbcgoodfood.com/search/recipes/page/${j}/?sort=-date          
          url = `https://www.birmingham.ac.uk/university/colleges/eps/eps-community/students/societies/ubrobotics.aspx`
        try{

        }
        catch(e){

        }
          await axios.get(url).then(resp => {
          console.log(resp.data);
          const $ = cheerio.load(resp.data);
          var recipeUrls = $(".standard-card-new__article-title");
            let tempCount = 0;
          for (let i = 0; i < recipeUrls.length; i++){
            let recipeUrlPart = recipeUrls[i].attribs.href;
            const recipeUrl = "https://www.bbcgoodfood.com" + recipeUrlPart;
            if(recipeUrl.includes("premium")){
                console.log("this is a premium recipe")
            }
            else{
            try {
              // console.log("bro this tuf" + recipeUrl);
              axios.get(recipeUrl).then(async (resp) => {
                const recipe = {
                  title: null,
                  cuisine: null,
                  ingredients: [],
                  method: [],
                  time: {
                    preparation: null,
                    cooking: null,
                  },
                  serves: null,
                  rating: {
                    average: null,
                    count: null,
                    total: null,
                  },
                  self_url: recipeUrl,
                };
                let thisRecipe = recipe;
                if(resp.data != null){                
                try {
                  await limit()
                  // let testPromise = await Promise(bob(resp.data,recipe)).catch((e)=>{console.log("we might have found it chief" + e)}); 
                  // thisRecipe = await Promise.resolve(bob(resp.data,recipe)).catch((e)=>{console.log("we might have found it chief" + e)});
                  thisRecipe = await bob(resp.data,recipe);

                } catch (error) {
                  console.log("this is the error: " + error);
                }
              }
                recipes.push(thisRecipe);
                let titleRecipe = thisRecipe.title;
                const nameUnderScore = titleRecipe.replaceAll(' ', '');

                const dbRef = ref(getDatabase());
                get(child(dbRef, `recipes/${recipe.title}`)).then((snapshot) => {
                  if (snapshot.exists()) {
                    // console.log(snapshot.val());
                  } else {
                    console.log(thisRecipe.self_url)
                    writeRecipe(nameUnderScore, thisRecipe.ingredients, thisRecipe.self_url);
                  }
                }).catch((error) => {
                  console.error(error);
                });
                tempCount++;
                // if(tempCount == (recipeUrls.length-2)){
                //   j++;
                // }
              }
              ).catch((e)=>{console.log("maybe this one")})
            }            
            catch(err){
              console.log("get error" + err);
            }
            // console.log(recipes);
          }
        }
        }).catch((e) => {console.log("another error" + e)});
      }
    })().catch( e => { console.error("total error my g" + e) })

      // loadRecipes(finishedRecipes());
      // console.log(recipes);

   async function bob (html, recipe){

    // try{
    //   const { html } = await axios.get(url);
    // }
    // catch (err) {
    //   console.error(err);
    // }
    const $ = cheerio.load(html);
    try {
      if (url.match(/https:\/\/www.bbcgoodfood.com/)) {
        console.log("Good Food");
        recipe.title = $("h1").text();
        if (!recipe.title || recipe.title.length < 1) {
          // return res.send({ error: "Not a valid BBC Good Food URL" });
        } else {
          $(".recipe__ingredients ul li.list-item").each(function (
            index,
            item
          ) {
            // Trim string up to line break where ingredient anchor description starts
            var lineBreak = $(this).text().indexOf("\n");
            if (lineBreak > 0) {
              recipe.ingredients.push($(this).text().substring(0, lineBreak));
            } else {
              recipe.ingredients.push($(this).text());
            }
          });
          $(".recipe__method-steps ul .list-item p").each(function (
            index,
            item
          ) {
            recipe.method.push($(this).text());
          });
          recipe.time = {
            prep: $(".cook-and-prep-time .list").find("time").first().text(),
            cook: $(".cook-and-prep-time .list").find("time").last().text(),
          };
          recipe.serves = $(".post-header__servings")
            .children()
            .last()
            .text();
          recipe.image = $(".post-header__image-container img").attr("src");
          // console.log(recipe);
          return recipe;
        }
      } else if (url.match(/https:\/\/www.bbc.co.uk\/food\//)) {
        console.log("BBC Food");
        /**
         *  Load Recipe Schema and populate recipe data from that
         */
        const schemaJSON = $("script[type='application/ld+json']")
          .map((i, el) => {
            return JSON.parse(el.children[0].data);
          })
          .filter((i, el) => {
            return el["@type"] === "Recipe";
          });
        const recipeData = schemaJSON["0"] || null;
        if (!recipeData) {
          // throw new Error("Recipe not found");
        }
        recipe.title = recipeData.name;
        recipe.ingredients = recipeData.recipeIngredient;
        recipe.method = recipeData.recipeInstructions;

        const prepTime = parse(recipeData.prepTime);
        const cookTime = parse(recipeData.cookTime);
        recipe.time = {
          prep: `${prepTime.hours ? "" + prepTime.hours + " hours" : ""} ${
            prepTime.minutes ? "" + prepTime.minutes + " minutes" : ""
          }`,
          cook: `${cookTime.hours ? "" + cookTime.hours + " hours" : ""} ${
            cookTime.minutes ? "" + cookTime.minutes + " minutes" : ""
          }`,
        };

        recipe.serves = recipeData.recipeYield;
        recipe.image = recipeData.image[0];
    }
      
   }catch(err){
      console.log(err);
   }
  }
  export default firebaseApp
    //         return res.send(recipe);
    //       } else {
    //         res.send({ error: "Website not yet supported" });
    //       }
    //     } catch (err) {
    //       res.send({ error: "Invalid URI" });
    //     }
    //   } else {
    //     res.send({ error: "Invalid URI" });
    //   }

//     });
//   });