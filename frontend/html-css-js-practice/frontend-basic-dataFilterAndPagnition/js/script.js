const btnUl=document.querySelector('[data-pagBTN]');
const studentUl=document.querySelector('[data-studentUl]')
const header=document.querySelector('.header');
const searchInput=document.querySelector('#search');


/*
Create the `showPage` function
This function will create and insert/append the elements needed to display a "page" of nine students
*/
const showPage=(currentPage, dataCollection, itemPerPage, totalPages)=>{
  // 清空之前页
  studentUl.innerHTML="";


    const firstItemIndex=(currentPage-1)*itemPerPage
    var lastItemIndex=(currentPage == totalPages)? (dataCollection.length-1): (firstItemIndex+itemPerPage-1)
  
    dataCollection.slice(firstItemIndex, lastItemIndex+1).forEach(item=> {
      const student=document.createElement('li');
      student.className="student-item cf";
      student.innerHTML=`
        <div class="student-details">
          <img class="avatar" src=${item.picture.large} alt="Profile Picture">
          <h3>${item.name.first} ${item.name.last}</h3>
          <span class="email">${item.email}</span>
        </div>
        <div class="joined-details">
          <span class="date">Joined ${item.registered.date}</span>
        </div>
      `
      studentUl.appendChild(student);
    })
  
}

/*
Create the `addPagination` function
This function will create and insert/append the elements needed for the pagination buttons
*/

const pagPart=(dataInput, itemPerPage)=> {
  showPage(1, dataInput, itemPerPage);
  btnUl.innerHTML="";
  const pagenumbers=Math.ceil(dataInput.length/itemPerPage)
  const range = (first, stop, step) => Array.from({ length: (stop - first) / step + 1}, (_, i) => first + (i * step));

  const pageArray=range(1, pagenumbers, 1);   /* yield an array [1, 2, 3, 4, 5] */

pageArray.forEach(item=> {
  const pagBtn= document.createElement('li');
  pagBtn.innerHTML=`<button>${item}</button>`;
  btnUl.appendChild(pagBtn);
  pagBtn.addEventListener('click', (e)=> {
    // 'page-1' is the index of the btnUl array
    const page=e.target.textContent;
    e.target.className="active";
    [...btnUl.children].forEach((item, index) => (index==page-1)? null : (item.firstChild.className=""));
    showPage(page, dataInput, itemPerPage, pagenumbers);
  });
})
btnUl.children[0].firstChild.className="active";
}



/* -------------------------search function------------------------*/

const search=(event)=>{
  keyWord=searchInput.value;
  dataCollection=data.filter(item=>item.name.first.toLowerCase().includes(keyWord.toLowerCase()) || item.name.last.toLowerCase().includes(keyWord.toLowerCase()));
  if (dataCollection.length===0) {
    studentUl.innerHTML="<h1 style='text-align: center;'>No Results returned, try again</h1>";
    btnUl.innerHTML="";
    
  } else {
    pagPart(dataCollection, 9)
  } 
}

searchInput.addEventListener('keyup', search)

/* -------------------------search function------------------------*/


pagPart(data, 9)




