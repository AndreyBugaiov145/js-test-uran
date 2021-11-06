const defaultTagsArray = [{id: 1, name: 'good'}, {id: 2, name: 'hello'}, {id: 3, name: 'dog'}
]
let $node = document.querySelector('#app')

class TagList {
    tagsArray;
    $appNode;
    editing = true;
    widgetView;


    constructor(node, tags = []) {
        this.tagsArray = tags
        this.$appNode = node
        this.widgetView = new WidgetView
        this.mount()
    }

    changeCondition(event) {
        const button = event.currentTarget
        if (button.className.indexOf("my-disabled") > 0) {
            return
        }
        this.editing = !this.editing
        this.mount()
    }

    getTagList() {
        let tagNameArray = []
        Object.keys(this.tagsArray).forEach((key)=>{
            tagNameArray.push(this.tagsArray[key].name)
        })

        return tagNameArray
    }

    render() {
        let renderHtml = '';
        if (this.editing) {
            renderHtml += this.widgetView.startWidgetHtml('Просмотр')
            this.tagsArray.forEach((el) => {
                renderHtml += this.widgetView.tagToHtmlWithButton(el.name, el.id)
            })
            renderHtml += this.widgetView.endWidgetHtml()
        } else {
            renderHtml += this.widgetView.startWidgetHtml('редактировать')
            this.tagsArray.forEach((el) => {
                renderHtml += this.widgetView.tagToHtml(el.name, el.id)
            })
            renderHtml += this.widgetView.endWidgetHtml()
        }


        return renderHtml;
    }

    deleteTag(event) {
        const button = event.currentTarget
        if (button.className.indexOf("my-disabled") > 0) {
            return
        }
        const tagId = button.dataset.tagid
        this.tagsArray = this.tagsArray.filter(tag => tag.id != tagId)
        this.mount()
    }

    addTag(event) {
        const button = event.currentTarget
        if (button.className.indexOf("my-disabled") > 0) {
            return
        }
        let tegId = Date.now()
        this.tagsArray.unshift({id: tegId, name: 'новый тег'})
        button.insertAdjacentHTML("afterend", this.widgetView.tagInputHtml(tegId, 'новый тег'));
        const input = document.getElementById(tegId)
        input.focus()

        this.addInputHandler(tegId)
        this.setDisabledAllBtn()
    }

    changeTag(event) {
        this.mount()

        const button = event.currentTarget
        if (button.className.indexOf("my-disabled") > 0) {
            return
        }
        const tagId = button.dataset.tagid
        const tag = document.getElementById(tagId)
        const tagValue = this.tagsArray.filter(tag => tag.id == tagId)[0].name
        tag.outerHTML = this.widgetView.tagInputHtml(tagId, tagValue)
        const input = document.getElementById(tagId)
        input.focus()
        this.addInputHandler(tagId)
        this.setDisabledAllBtn()
    }

    setDisabledAllBtn() {
        setTimeout(() => {
            const buttons = document.getElementsByClassName('my-btn')
            for (let button of buttons) {
                button.classList.add("my-disabled")
            }
        })
    }

    setNotDisabledAllBtn() {
        const buttons = document.getElementsByClassName('my-button')
        for (let button in buttons) {
            button.classList.remove("my-disabled")
        }
    }

    changeTagHandler(event) {
        const input = event.currentTarget
        this.tagsArray = this.tagsArray.map((tag) => {
            if (tag.id == input.id) {
                tag.name = event.currentTarget.value
            }
            return tag
        })
        this.mount()
    }

    addInputHandler(id) {
        setTimeout(() => {
            const input = document.getElementById(id)
            input.addEventListener('blur', (event) => this.changeTagHandler(event))
            input.addEventListener('keypress', (event) => {
                if (event.keyCode == '13') {
                    this.changeTagHandler(event)
                }
            })
        }, 0)
    }

    addHandler() {
        setTimeout(() => {
            let deleteButtons = document.getElementsByClassName('delete')
            for (let deleteButton of deleteButtons) {
                deleteButton.addEventListener('click', (event) => {
                    this.deleteTag(event)
                })
            }

            let changeButtons = document.getElementsByClassName('change')
            for (let changeButton of changeButtons) {
                changeButton.addEventListener('click', (event) => {
                    this.changeTag(event)
                })
            }

            let addButtons = document.getElementsByClassName('add')
            for (let button of addButtons) {
                button.addEventListener('click', (event) => {
                    this.addTag(event)
                })
            }

            let conditionButtons = document.getElementsByClassName('condition')
            for (let button of conditionButtons) {
                button.addEventListener('click', (event) => {
                    this.changeCondition(event)
                })
            }
            let $getTagList = document.getElementById('getTagList')
            $getTagList.addEventListener('click', (event) => {
                $getTagList.innerHTML = 'Посмотреть список тега в виде масива (метод getTagList' + '<br/>' + JSON.stringify(this.getTagList())
            })


        }, 0)
    }

    mount() {
        this.$appNode.innerHTML = this.render()
        this.addHandler()
    }
}

class WidgetView {
    startWidgetHtml(buttonText) {
        return `${this.appConditionButtonHtml(buttonText)}${this.addButtonHtml()}<ul class="list-group">`
    }

    endWidgetHtml() {
        return '</ul>'
    }

    tagToHtml(tagName, id) {
        return `<li class="list-group-item"><span class="tag-base" id="${id}">${tagName}</span></li>`
    }

    tagToHtmlWithButton(tagName, id) {
        return `<li class="list-group-item"><span class="tag-base" id="${id}">${tagName}</span>${this.changeTagButtonHtml(id)}${this.deleteButtonHtml(id)}</li>`
    }

    deleteButtonHtml(tagId) {
        const buttonHtml = `
                <span class="delete my-btn" data-tagId="${tagId}" >
                    <svg width="1em" height="1em" viewBox="0 0 16 16" class="bi bi-trash" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                      <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0V6z"/>
                      <path fill-rule="evenodd"
                            d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1v1zM4.118 4L4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4H4.118zM2.5 3V2h11v1h-11z"/>
                    </svg>
                </span>`

        return buttonHtml
    }

    addButtonHtml() {

        return `<button type="button" class="btn btn-success add my-btn">Добавить</button>`
    }

    changeTagButtonHtml(tagId) {
        const buttonHtml = `
                <span class="change my-btn" data-tagId="${tagId}">
                    <svg width="1em" height="1em" viewBox="0 0 16 16" class="bi bi-pencil" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                        <path fill-rule="evenodd" d="M11.293 1.293a1 1 0 0 1 1.414 0l2 2a1 1 0 0 1 0 1.414l-9 9a1 1 0 0 1-.39.242l-3 1a1 1 0 0 1-1.266-1.265l1-3a1 1 0 0 1 .242-.391l9-9zM12 2l2 2-9 9-3 1 1-3 9-9z"/>
                        <path fill-rule="evenodd" d="M12.146 6.354l-2.5-2.5.708-.708 2.5 2.5-.707.708zM3 10v.5a.5.5 0 0 0 .5.5H4v.5a.5.5 0 0 0 .5.5H5v.5a.5.5 0 0 0 .5.5H6v-1.5a.5.5 0 0 0-.5-.5H5v-.5a.5.5 0 0 0-.5-.5H3z"/>
                    </svg>
                </span>`

        return buttonHtml
    }

    appConditionButtonHtml(text) {
        const buttonHtml = `<button type="button" class="btn btn-success condition my-btn">${text}</button>`

        return buttonHtml
    }

    tagInputHtml(id = '', value) {
        return `<input type="text" class="form-control my-input" id="${id}"  value="${value}" placeholder="Username" aria-label="Username" aria-describedby="basic-addon1">`
    }
}


const tagList =  new TagList($node, defaultTagsArray)
