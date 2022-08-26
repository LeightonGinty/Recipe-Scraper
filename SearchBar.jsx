import './App.css';
import React from 'react';
import { getDatabase, ref, set, child, get, onValue } from "firebase/database";
import Firebase from './Recipe.js'
function SearchBar() {


  const database = getDatabase(Firebase);
  const starCountRef = ref(db, 'recipes/');
  onValue(starCountRef, (snapshot) => {
    const data = snapshot.val();
    updateStarCount(postElement, data);
  });
    function myFunction() {
        document.getElementById("myDropdown").classList.toggle("show");
        onValue();
      }
      function filterFunction() {
        var input, filter, ul, li, a, i;
        input = document.getElementById("myInput");
        filter = input.value.toUpperCase();
        var div = document.getElementById("myDropdown");
        a = div.getElementsByTagName("a");
        for (i = 0; i < a.length; i++) {
          var txtValue = a[i].textContent || a[i].innerText;
          if (txtValue.toUpperCase().indexOf(filter) > -1) {
            a[i].style.display = "";
          } else {
            a[i].style.display = "none";
          }
        }
      }

    return ( <div class="dropdown">
    <button onClick={myFunction} class="dropbtn">Dropdown</button>
    <div id="myDropdown" class="dropdown-content">
      <input type="text" placeholder="Search.." id="myInput" onKeyUp={filterFunction}/>
      <a href="#about">About</a>
      <a href="#base">Base</a>
      <a href="#blog">Blog</a>
      <a href="#contact">Contact</a>
      <a href="#custom">Custom</a>
      <a href="#support">Support</a>
      <a href="#tools">Tools</a>
      <div id="recipe">

      </div>
    </div>
  </div> );
}

export default SearchBar;