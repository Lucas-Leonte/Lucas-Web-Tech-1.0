async function ShowSellerHomePage() {
    await ShowNavbar();
    await ShowFooter();

    const theUrl = "api-products.php"

    //prova collocazione repository personale Lucas

    fetch(theUrl, {
        method: "GET",
        headers: {
            'Content-Type': 'application/json'
        }
    }).then(res => res.json()).then(jsonRes => {

        //console.log(jsonRes.length)
        let theInnerProducts = ``

        for(let theColNum = 0; theColNum < jsonRes.length; theColNum++){
            let theImageUrl = jsonRes[theColNum].ImageName
            let theName = jsonRes[theColNum].Name
            let thePrice = jsonRes[theColNum].Price

            theInnerProducts +=
             `<div id="sellerItemWrapper">
                    <img id="previewImage" src="${theImageUrl}"/>
                    <h3 id="previewTitle">${theName}</h3>
                    <button id="previewEdit">${thePrice}</button>
                    <button id="previewDelete">Delete</button>
            </div>`
        }

        let theOuterContent = `
            <div id="theOuterDiv">            
                <div id="addNewItem">
                    <button>Add An Item</button>           
                </div>                    
                ${theInnerProducts}
                <section>
                    <form>
                        <input type="text" placeholder="Name" name="productName"/>
                        <input type="text" placeholder="Price" name="productPrice"/>
                        <input type="file" placeholder="FileName" name="productFile"/>
                        
                        <input type="submit" value="Add Iten"/>
                    </form>
                </section>
            </div>`
        
        
        document.querySelector("main").innerHTML = theOuterContent

        let thePopWrapper = document.querySelector('section')
        thePopWrapper.addEventListener('click', (e)=>{
            if(e.target.nodeName == "SECTION"){
                e.target.classList.remove('show')
            }
        })

        let theAddItenBtn = document.querySelector('main div div button')
        theAddItenBtn.addEventListener('click', ()=>{
            thePopWrapper.classList.add('show')
        })

        let theForm = document.querySelector('form')
        theForm.addEventListener('submit', async (e) => {
            e.preventDefault()
            let theProductName = document.querySelector('input[name=productName]').value
            let theProductPrice = document.querySelector('input[name=productPrice]').value
            let theProductFile = document.querySelector('input[name=productFile]').files[0]

            //instance of a form
            let theFormData = new FormData()
            //assigning values to the Form
            theFormData.append('name', theProductName)
            theFormData.append('price', theProductPrice)
            theFormData.append('file', theProductFile)

            //send form data to the API
            let response = await fetch('./api-new-seller-item.php', {
                method: "POST",
                body: theFormData
            })
            let result = await response.json()
            console.log(result)

            // Refresh the seller home page to show the new product
            ShowSellerHomePage()
        })

    })
}

// Copia delle funzioni ShowNavbar e ShowFooter da customer.js

async function ShowNavbar() {
    const iconLogout = await LoadSvg("icon-logout");
    const iconNotifications = await LoadSvg("icon-notifications");

    document.querySelector("nav").innerHTML = `
    <ul>
        <li>
            <figure>
                ${iconLogout}
            </figure>
        </li>
        <li>
        </li>
        <li>
            <figure>
                ${iconNotifications}
            </figure>
        </li>
    </ul>`;

    document.querySelector("nav > ul > li:first-child").addEventListener(EVENT_CLICK, e => {
        e.preventDefault();
        Logout();
    })
}

async function ShowFooter() {
    const iconHome = await LoadSvg("icon-home");
    const iconSearch = await LoadSvg("icon-search");
    const iconUser = await LoadSvg("icon-user");
    const iconCart = await LoadSvg("icon-cart");

    document.querySelector("footer").innerHTML = `
        <ul>
            <li>
                <figure>
                    ${iconHome}
                </figure>
            </li>
            <li>
                <figure>
                    ${iconSearch}
                </figure>
            </li>
            <li>
                <figure>
                    ${iconUser}
                </figure>
            </li>
            <li>
                <figure>
                    ${iconCart}
                </figure>
            </li>
        </ul>`;

    let icons = document.querySelectorAll("footer ul li");

    icons[0].addEventListener("click", e => {
        e.preventDefault();
        ShowSellerHomePage();
    });

    icons[1].addEventListener("click", e => {
        e.preventDefault();
        ShowSearchPage();
    });

    icons[2].addEventListener("click", e => {
        e.preventDefault();
        ShowSellerHomePage();
    });

    icons[3].addEventListener("click", e => {
        e.preventDefault();
        ShowSellerHomePage();
    });
}