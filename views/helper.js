function lastElem(arr) {
    return arr[arr.length - 1]
}

function toggle_tab(e, selectedTab) {
    toggle_submenu(-1)
    for (let elem of document.querySelectorAll(".tab-pane")) {
        elem.classList.remove("active")
    }
    for (let elem of document.querySelectorAll(".tab-label")) {
        elem.classList.remove("active")
    }

    let href = selectedTab.getAttribute("href").replace("#", '')
    let currentTab = document.getElementById(href)
    currentTab.classList.add("active")
    
    let rightControls = document.getElementById("right-controls")
    if (href == "home") {
        rightControls.classList.remove("ng-hide")
    } else {
        rightControls.classList.add("ng-hide")
    }
}

function toggle_submenu(number, total = 3) {
    let mock_main_menu = document.getElementById("mock-main-menu")
    let hidden = false
    for (let i = 0; i < total; i++) {
        let current_submenu = document.getElementById("submenu-" + i)
        if (i == number) {
            current_submenu.classList.toggle("ng-hide")
            if(current_submenu.classList.contains("ng-hide")) hidden = true
        } else {
            current_submenu.classList.add("ng-hide")
        }
    }

    if (hidden || number == -1) {
        mock_main_menu.classList.remove("mock-submenu")
    } else {
        mock_main_menu.classList.add("mock-submenu")
    }
}

function close_modal(id) {
    document.getElementById(id).classList.add("ng-hide")
}

function isElectron() {
    return window && window.process && window.process.type
}

function copyLab(e) {
	e.preventDefault()
	
    let script = document.getElementById('sh_script').value
	electron.ipcRenderer.send('script:copy', script, 'script.sh')
	
    document.getElementById('lstart').classList.remove("disabledLink")
    document.getElementById('lclean').classList.remove("disabledLink")
	isCopied = true
}

function executeStart(e) {
    toggle_submenu(-1)
	executeGeneric(e, "execute")
	isRunning = true
}

function executeClean(e) {
    toggle_submenu(-1)
	executeGeneric(e, "clean")
	isRunning = false
}

function executeGeneric(e, command){
    e.preventDefault()
    if (isCopied) {
        let modal = document.getElementById("command-modal")
        modal.classList.remove("ng-hide")
        electron.ipcRenderer.send('script:' + command)
    }
}