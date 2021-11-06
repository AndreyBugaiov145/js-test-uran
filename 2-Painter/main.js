window.onload = function (event) {
    class CanvasPainter {
        canvas;
        $canvas;
        ctx;
        lineWidth = 10;
        lineColorArray = ['green', 'red', 'blue', 'black']
        lineWidthArray = [10, 15, 20]
        lineColor = 'green';
        isMoseDown = false;

        constructor() {
            this.$canvas = $('#canvas')
            this.canvas = this.$canvas[0]
            this.ctx = this.canvas.getContext("2d")
            const appDiv = $('#app')
            this.canvas.width = appDiv.width()
            this.canvas.height = appDiv.height()
            this.addCanvasHandler()
            this.renderColorSelectMenu()
            this.renderThicknessSelectMenu()
        }

        addCanvasHandler() {
            $('#clear').on('click', () => this.clear())
            $('#save').on('click', () => this.saveImage())

            this.$canvas.on("mousedown", (e) => {
                this.isMoseDown = true;
            })
            this.$canvas.on("mouseup", (e) => {
                this.isMoseDown = false;
                this.ctx.beginPath()
            })

            this.$canvas.on("mousemove", (e) => {
                this.ctx.strokeStyle = this.lineColor;
                this.ctx.lineWidth = this.lineWidth;
                this.ctx.fillStyle = this.lineColor;
                if (this.isMoseDown) {
                    this.ctx.lineTo(e.offsetX, e.offsetY);
                    this.ctx.stroke();
                    this.ctx.beginPath()
                    this.ctx.arc(e.offsetX, e.offsetY, this.lineWidth / 2, 0, Math.PI * 2);
                    this.ctx.fill();
                    this.ctx.beginPath()
                    this.ctx.moveTo(e.offsetX, e.offsetY);
                }
            })

        }

        clear() {
            this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        }

        renderColorSelectMenu() {
            const colorMenu = $('#select-color')
            this.lineColorArray.forEach((color) => {
                const menuItem = $(`<span class="my-color-block h" data-value=${color}></span>`)
                if (this.lineColor === color) {
                    menuItem.addClass('my-active')
                }
                menuItem.css({"backgroundColor": color})
                menuItem.click((event) => {
                    $('.my-color-block').removeClass("my-active")
                    $(event.target).addClass("my-active")
                    this.lineColor = event.target.dataset.value
                })
                colorMenu.append(menuItem)
            })
            $('#eraser').click((event) => {
                $('.my-color-block').removeClass("my-active")
                $(event.currentTarget).addClass("my-active")
                this.lineColor = event.currentTarget.dataset.value
            })
        }

        renderThicknessSelectMenu() {

            const thicknessMenu = $('#select-thickness')
            this.lineWidthArray.forEach((size) => {
                const menuItem = $(`<span class="my-thickness-block" data-value=${size}></span>`)
                if (this.lineWidth === size) {
                    menuItem.addClass('my-active')
                }
                menuItem.css({"width": size + 'px', "height": size + 'px'})
                menuItem.click((event) => {
                    $('.my-thickness-block').removeClass("my-active")
                    $(event.target).addClass("my-active")
                    this.lineWidth = event.target.dataset.value
                })
                thicknessMenu.append(menuItem)
            })
        }

        saveImage() {
            var dataURL = this.canvas.toDataURL("image/png");
            var img = new Image(this.canvas.width, this.canvas.height);
            img.src = dataURL;
            var link = document.createElement('a');
            link.href = dataURL;
            link.download = 'Download.jpg';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        }

    }

    canvas = new CanvasPainter()
}