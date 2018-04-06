class Game {
    constructor() {
        createCanvas(window.innerWidth, window.innerHeight)

        this.stats = new Stats()
        this.wavePointSpacing = 10
        this.groundPointSpacing = 10
        this.nWavePoints = 2 + floor(window.innerWidth / this.wavePointSpacing)
        this.nGroundPoints = 2 + floor(window.innerWidth / this.groundPointSpacing)
        this.waveAnimationFrame = 0
        this.groundAnimationFrame = 0
        this.distanceTravelled = 0
        this.flagAnimationOffset = 0
        this.sunAnimationFrame = 0
        this.xOffset = 0
        this.boatConstantAngle = 0.05
        this.sinkHeight = 13
        this.downKeys = {}
        this.boatImg = loadImage("boat.png")
        this.sunResized = false

        this.initGui()
    }

    initGui() {
        document.body.appendChild(this.stats.dom)

        this.waveHeightSlider = createSlider(10,60,30,1)
        this.waveHeightSlider.position(width - 150, 30)

        this.keysContainer = createDiv('Move: <span class="key">&larr;</span><span class="key">&rarr;</span>')
        this.keysContainer.position(width - 140, 70)
    }

    getWaveHeight(x) {
        return sin((x * 0.01 + this.waveAnimationFrame)) * this.waveHeightSlider.value()
    }

    keyPressed(e) {
        this.downKeys[e.key] = true
    }

    keyReleased(e) {
        this.downKeys[e.key] = false
    }

    drawWater() {
        beginShape()
        strokeWeight(2)
        stroke(50, 50, 50, 200)
        fill(230, 230, 230, 200)

        for (let i = 0; i < this.nWavePoints; i++) {
            let ptX = i * this.wavePointSpacing
            let ptY = this.getWaveHeight(ptX)
            vertex(ptX, ptY)

            // fill(255)
            // noStroke()
            // ellipse(ptX, ptY, 8)
        }
        vertex(width, height)
        vertex(0, height)
        endShape()
    }

    drawBoat() {
        fill(100)
        let w = this.boatImg.width
        let h = this.boatImg.height

        let xleft = width * 0.5 - w * 0.5 + this.xOffset
        let xright = width * 0.5 + w * 0.5 + this.xOffset

        let yleft = this.getWaveHeight(xleft)
        let yright = this.getWaveHeight(xright)

        let a = Math.atan2(yright - yleft, xright - xleft)

        push()

        translate(width * 0.5 - w * 0.5 + this.xOffset, yleft)
        rotate(a + this.boatConstantAngle)
        image(this.boatImg, 0, -h + this.sinkHeight)

        // draw flag
        stroke(200, 50, 50)
        strokeWeight(2)
        let flagToX = w * 0.55
        let flagFromX = w * 0.2
        let flagY = -h + this.sinkHeight
        let nLines = flagToX - flagFromX
        let flagSpeedOffset = 0

        if (this.downKeys.ArrowLeft) {
            flagSpeedOffset = -0.2
        } else if (this.downKeys.ArrowRight) {
            flagSpeedOffset = 0.2
        }

        for (let i = 0; i < nLines; i++) {
            let fromY = flagY + sin(i * 0.2 + this.flagAnimationOffset * (0.3 + flagSpeedOffset)) * (nLines - i) * 0.2
            let toY = flagY + sin((i + 1) * 0.2 + this.flagAnimationOffset * (0.3 + flagSpeedOffset)) * (nLines - i) * 0.2
            line(flagFromX + i, fromY, flagFromX + i + 1, toY)
        }

        pop()

        // debug boat target points
        // fill(255, 0, 0)
        // ellipse(xleft, yleft, 10)
        // ellipse(xright, yright, 10)
    }

    drawGround() {
        noStroke()
        fill(0)
        beginShape()
        for (let i = 0; i < this.nGroundPoints; i++) {
            let x = i * this.groundPointSpacing
            let y = noise((i + this.groundAnimationFrame * 0.4)* 0.05) * 50
            vertex(x, y)
        }
        vertex(width, height)
        vertex(0, height)
        endShape()
    }

    drawBackground() {
        stroke(100)
        strokeWeight(1)
        fill(230)
        beginShape()
        for (let i = 0; i < this.nGroundPoints; i++) {
            let x = i * this.groundPointSpacing
            let y = noise((i + this.groundAnimationFrame * 0.1)* 0.05) * 250
            vertex(x, y)
        }
        vertex(width, height)
        vertex(0, height)
        endShape()
    }

    updateBoatOffset() {
        if (this.downKeys.ArrowLeft) {
            this.xOffset -= 2
        } else if (this.downKeys.ArrowRight) {
            this.xOffset += 2
        }
    }

    draw() {
        background(240)

        this.updateBoatOffset()

        push()
        translate(0, height * 0.35)
        this.drawBackground()
        pop()

        push()
        translate(0, height - 50)
        this.drawGround()
        pop()

        push()
        translate(0, height * 0.7)
        this.drawBoat()
        this.drawWater()
        pop()

        this.waveAnimationFrame += 0.04
        this.flagAnimationOffset++
        this.groundAnimationFrame++
        this.sunAnimationFrame++

        this.stats.update()
    }
}
