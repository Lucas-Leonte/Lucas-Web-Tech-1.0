EVENT_CLICK = "click"

function ReportAndCheckFormValidity(form) {
    form.reportValidity();
    return form.checkValidity();
}

async function ShowLoginPage() {
    document.querySelector("main").innerHTML = `
        <form action="" method="POST">
            <fieldset>
                <input type="email" id="email" name="email" placeholder="Email *" required value="test.prova@gmail.com"/>
                <input type="password" id="password" name="password" placeholder="Password *" required value="1234"/>
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

    document.querySelector("main").innerHTML = ``;

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
                <article>
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
            
    } catch (error) {
        console.log(error.message);
    }
}

let cartProducts;

function CalculateCartProductsTotalPrice() {
    let total = 0;
    for (let product in cartProducts) {
        total += product[i]["Price"] * product[i]["Quantity"];
    }
}

async function ShowCartProducts() {
    const url = 'api-cart-products.php';
    
    try {
        const response = await fetch(url, {
            method: "GET",
        });

        if (!response.ok) {
            throw new Error(`Response status: ${response.status}`);
        }

        cartProducts = await response.json();

        let main = document.querySelector("main");
        let articles = "";

        for (let i = 0; i < products.length; i++) {
            articles += `
                <article>
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
                        <section>
                            <h2>-</h2>
                            <h2>${products[i]["Quantity"]}</h2>
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
                <h2>Total: ${}</h2>
            </section>`;

        // TODO: pulsanti + e -
        document.querySelectorAll("article > footer > section > h2:first-child").forEach(x => {
            // x.addEventListener()
        })
            
    } catch (error) {
        console.log(error.message);
    }
}

async function ShowSearchPage() {
    await ChangeSelectedIcon(2);

    document.querySelector("main").innerHTML = "";
}

async function ShowUserPage() {
    await ChangeSelectedIcon(3);

    document.querySelector("main").innerHTML = "";
}

async function ShowCartPage() {
    await ChangeSelectedIcon(4);

    document.querySelector("main").innerHTML = "";

    await ShowCartProducts();
}

this.ShowLoginPage();