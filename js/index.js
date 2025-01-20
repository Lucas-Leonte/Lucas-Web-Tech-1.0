EVENT_CLICK = "click"

let cartProducts;
let selectedProductId;

function ReportAndCheckFormValidity(form) {
    form.reportValidity();
    return form.checkValidity();
}

async function ShowLoginPage() {
    document.querySelector("main").innerHTML = `
        <form action="" method="POST">
            <fieldset>
                <label for="email">Email: </label>
                <input type="email" id="email" name="email" placeholder="Email *" required value="test.prova@gmail.com"/>
                <label for="password">Password: </label>
                <input type="password" id="password" name="password" placeholder="Password *" required value="test"/>
            </fieldset>
            <input type="submit" value="Accedi"/>
            <p>Non hai un account? <a href="javascript:ShowSignUpPage()">Registrati</a></p>
        </form>`;

    document.querySelector("main form input[type=submit]").addEventListener(EVENT_CLICK, e => {
        e.preventDefault();

        if (ReportAndCheckFormValidity(document.querySelector("form"))) {
            Login();
        }
    });
}

async function ShowSignUpPage() {
    document.querySelector("main").innerHTML = `
        <form action="" method="POST">
            <fieldset>
                <input type="email" id="email" name="email" placeholder="Email *" required/>
                <input type="tel" id="tel" name="tel" placeholder="Telefono"/>
                <input type="password" id="password" name="password" placeholder="Password *" required/>
                <input type="password" id="confirm-password" name="confirm-password" placeholder="Conferma Password *" required/>
            </fieldset>
            <input type="submit" value="Registrati">
            <p>Hai già un account? <a href="javascript:ShowLoginPage()">Accedi</a></p>
        </form>`;

    document.querySelector("main form input[type=submit]").addEventListener(EVENT_CLICK, e => {
        e.preventDefault();

        if (ReportAndCheckFormValidity(document.querySelector("form"))) {
            SignUp();
        }
    });
}

async function LoadSvg(name) {
    const response = await fetch(`./resources/${name}.svg`);
    return await response.text();
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
        ShowHomePage();
    });

    icons[1].addEventListener("click", e => {
        e.preventDefault();
        ShowSearchPage();
    });

    icons[2].addEventListener("click", e => {
        e.preventDefault();
        ShowUserPage();
    });

    icons[3].addEventListener("click", e => {
        e.preventDefault();
        ShowCartPage();
    });
}

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
}

async function ChangeSelectedIcon(index) {
    document.querySelectorAll("footer ul li figure svg path").forEach(element => {
        element.setAttribute("stroke-width", 1.5);
    });

    document.querySelector(`footer ul li:nth-child(${index}) figure svg path`).setAttribute("stroke-width", 2.5);
}

async function ShowHomePage() {
    await ShowNavbar();
    await ShowFooter();

    await ChangeSelectedIcon(1);
    await ShowProducts();
}

async function Login() {
    const url = 'api-secure-login.php';

    const email = document.querySelector("input[type=email]").value;
    const password = document.querySelector("input[type=password]").value;
    
    const formData = new FormData();
    formData.append('email', email);
    formData.append('password', password);
    
    try {
        const response = await fetch(url, {
            method: "POST",                   
            body: formData
        });

        if (!response.ok) {
            throw new Error(`Response status: ${response.status}`);
        }

        const json = await response.json();
        console.log(json);

        if(json["success"]) {
            ShowHomePage();
        }
        // else{
        //     document.querySelector("form > p").innerText = json["error"];
        // }
    } catch (error) {
        console.log(error.message);
    }
}

async function SignUp() {
    const url = 'api-secure-signup.php';

    const password = document.querySelector("#password").value;
    const confirmPassword = document.querySelector("#confirm-password").value;

    if (password !== confirmPassword) {
        alert("Le password non corrispondono");
        return;
    }

    const email = document.querySelector("input[type=email]").value;
    const phoneNum = document.querySelector("input[type=tel]").value;
    
    const formData = new FormData();
    formData.append('email', email);
    formData.append('password', password);
    formData.append('phoneNum', phoneNum);
    
    try {
        const response = await fetch(url, {
            method: "POST",                   
            body: formData
        });

        if (!response.ok) {
            throw new Error(`Response status: ${response.status}`);
        }

        const json = await response.json();
        console.log(json);

        if(json["success"]) {
            ShowHomePage();
        }
        // else{
        //     document.querySelector("form > p").innerText = json["error"];
        // }
    } catch (error) {
        console.log(error.message);
    }
}

async function ShowProducts() {
    const url = 'api-products.php';
    
    try {
        const response = await fetch(url, {
            method: "GET",
        });

        if (!response.ok) {
            throw new Error(`Response status: ${response.status}`);
        }

        const products = await response.json();

        let main = document.querySelector("main");
        let articles = "";

        for (let i = 0; i < products.length; i++) {
            articles += `
                <article id="prod-${products[i]["ProductId"]}">
                    <header>
                        <h2>${products[i]["Name"]}</h2>
                    </header>
                    <section>
                        <figure>
                            <img src="${products[i]["ImageName"]}" alt=""/>
                            <figcaption></figcaption>
                        </figure>
                        <aside>
                            <h2>$${products[i]["Price"]}</h2>
                            <section>
                                <h2>${products[i]["PlayerNumFrom"]}-${products[i]["PlayerNumTo"]}</h2>
                            </section>
                        </aside>
                    </section>
                    <footer>
                        <h2>${products[i]["ShortDesc"]}</h2>
                    </footer>
                </article>`
        }

        main.innerHTML = `
            <section>
                ${articles}
            </section>`;

        document.querySelectorAll("main > section > article").forEach(element => {
            element.addEventListener(EVENT_CLICK, e => {
                e.preventDefault();
                
                let element = FindClosestParentOfEventArgs(e, "article");
                selectedProductId = ElementIdToDbId(element.id);
                ShowProductDetails();
            });
        });
    } catch (error) {
        console.log(error.message);
    }
}

function FindClosestParentOfEventArgs(eventArgs, tagName) {
    let element = eventArgs.target || eventArgs.srcElement;
    if (element.tagName.toLowerCase() === tagName) {
        return element;
    }
    return element.closest(tagName);
}

function ElementIdToDbId(elementId) {
    let strings = elementId.split('-');
    return strings[strings.length - 1];
}

function RecalculateCartProductsTotalPrice() {
    let total = 0;
    cartProducts.forEach(product => {
        total += product["Price"] * product["Quantity"];
    });

    document.querySelector("main > section:last-child > h2")
        .innerHTML = `Total: ${total} €`;
}

async function ExecutePostRequest(url, formData, onSuccess, onError) {    
    try {
        const response = await fetch(url, {
            method: "POST",
            body: formData
        });

        if (!response.ok) {
            throw new Error(`Response status: ${response.status}`);
        }

        onSuccess(await response.json());
    } catch (error) {
        onError(error);
    }
}

async function ShowCartProducts() {
    const url = 'api-cart.php';

    const formData = new FormData();
    formData.append('action', 1);
    
    try {
        const response = await fetch(url, {
            method: "POST",
            body: formData
        });

        if (!response.ok) {
            throw new Error(`Response status: ${response.status}`);
        }

        cartProducts = await response.json();

        let main = document.querySelector("main");
        let articles = "";

        for (let i = 0; i < cartProducts.length; i++) {
            articles += `
                <article id="cart-prod-${cartProducts[i]["ProductId"]}">
                    <header>
                        <h2>${cartProducts[i]["Name"]}</h2>
                    </header>
                    <section>
                        <figure>
                            <img src="${cartProducts[i]["ImageName"]}" alt=""/>
                            <figcaption></figcaption>
                        </figure>
                        <aside>
                            <h2>$${cartProducts[i]["Price"]}</h2>
                            <section>
                                <h2>${cartProducts[i]["PlayerNumFrom"]}-${cartProducts[i]["PlayerNumTo"]}</h2>
                            </section>
                        </aside>
                    </section>
                    <footer>
                        <section>
                            <h2>-</h2>
                            <h2>${cartProducts[i]["Quantity"]}</h2>
                            <h2>+</h2>
                        </section>
                    </footer>
                </article>`;
                // TEST
        }

        main.innerHTML = `
            <section>
                ${articles}
            </section>
            <section>
                <h2>Total: 0.00 €</h2>
                <input type="button" value="Procedi all'acquisto"/>
            </section>`;

        RecalculateCartProductsTotalPrice();

        document.querySelector(`main > section:last-child > input[type="button"]`).addEventListener(EVENT_CLICK, e => {
            e.preventDefault();
            CheckoutCart();
        });

        // TODO: pulsanti + e -
        let minusButtons = document.querySelectorAll("article > footer > section > h2:first-child");
        for (let i = 0; i < minusButtons.length; i++) {
            minusButtons[i].addEventListener(EVENT_CLICK, e => DecreaseCartProductQuantity(i));
        }

        let plusButtons = document.querySelectorAll("article > footer > section > h2:last-child");
        for (let i = 0; i < plusButtons.length; i++) {
            plusButtons[i].addEventListener(EVENT_CLICK, e => IncreaseCartProductQuantity(i));
        }
            
    } catch (error) {
        console.log(error);
    }
}

async function IncreaseCartProductQuantity(index) {
    const productId = cartProducts[index]["ProductId"];

    const formData = new FormData();
    formData.append("action", 2);
    formData.append("productId", productId);

    await ExecutePostRequest("api-cart.php", formData, newQuantity => {
        cartProducts[index]["Quantity"] = newQuantity;
        document.querySelector(`#cart-prod-${productId} > footer > section > h2:nth-child(2)`)
            .innerHTML = newQuantity;
    }, error => console.log(error));

    RecalculateCartProductsTotalPrice();
}

async function DecreaseCartProductQuantity(index) {
    const productId = cartProducts[index]["ProductId"];

    const formData = new FormData();
    formData.append("action", 3);
    formData.append("productId", productId);

    await ExecutePostRequest("api-cart.php", formData, newQuantity => {
        if (newQuantity <= 0) {
            cartProducts[index]["Quantity"] = 0;
            document.querySelector(`#cart-prod-${productId}`).remove();
        } else {
            cartProducts[index]["Quantity"] = newQuantity;
            document.querySelector(`#cart-prod-${productId} > footer > section > h2:nth-child(2)`)
                .innerHTML = newQuantity;
        }
    }, error => console.log(error));

    RecalculateCartProductsTotalPrice();
}

async function CheckoutCart() {
    const formData = new FormData();
    formData.append("action", 4);

    await ExecutePostRequest("api-cart.php", formData, result => {
        console.log(result);
        ShowCartPage();
    }, error => console.log(error));

    RecalculateCartProductsTotalPrice();
}

async function ShowProductDetails() {
    const formData = new FormData();
    formData.append("action", 1);
    formData.append("ProductId", selectedProductId);

    await ExecutePostRequest("api-product-details.php", formData, result => {
        document.querySelector("main").innerHTML = `
            <article>
                <header>
                    <h2>${result["Name"]}</h2>
                </header>
                <section>
                    <figure>
                        <img src="${result["ImageName"]}" alt=""/>
                        <figcaption></figcaption>
                    </figure>
                    <aside>
                        <h2>$${result["Price"]}</h2>
                        <section>
                            <h2>${result["PlayerNumFrom"]}-${result["PlayerNumTo"]}</h2>
                        </section>
                    </aside>
                </section>
                <footer>
                    <h2>${result["ShortDesc"]}</h2>
                    <input type="button" value="Aggiungi al carrello"/>
                </footer>
            </article>`;
        
        document.querySelector(`article > footer > input[type="button"]`).addEventListener(EVENT_CLICK, e => {
            e.preventDefault();
            AddProductToCart();
        });
    }, error => console.log(error));
}

async function AddProductToCart() {
    const formData = new FormData();
    formData.append("action", 2);
    formData.append("ProductId", selectedProductId);

    await ExecutePostRequest("api-product-details.php", formData, result => {
        console.log(result);
    }, error => console.log(error));
}

// async function 

async function ShowSearchPage() {
    await ChangeSelectedIcon(2);
}

async function ShowUserPage() {
    await ChangeSelectedIcon(3);
}

async function ShowCartPage() {
    await ChangeSelectedIcon(4);
    await ShowCartProducts();
}

async function ShowProductDetailsPage() {
    await ShowProductDetails();
}

this.ShowLoginPage();