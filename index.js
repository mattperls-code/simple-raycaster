const canvas = document.getElementById("canvas")
canvas.width = window.innerWidth - 20
canvas.height = window.innerHeight - 20
const ctx = canvas.getContext("2d")

const player = {
    x: -1,
    y: 0,
    theta: 70 * Math.PI / 180,
    fov: 80 * Math.PI / 180
}

const walls = []

const generateHardcodedWalls = () => {
    walls.push(
        {
            x1: -1,
            y1: 5,
            x2: 3,
            y2: 5,
            height: 1,
            color: "red"
        },
        {
            x1: 3,
            y1: 5,
            x2: 4,
            y2: 3,
            height: 1,
            color: "blue"
        },
        {
            x1: 1,
            y1: 2,
            x2: 2,
            y2: 2,
            height: 1,
            color: "green"
        },
        {
            x1: -2,
            y1: 6,
            x2: -1,
            y2: 2,
            height: 1,
            color: "yellow"
        }
    )
}

generateHardcodedWalls()

// const generateRegularPolygonWalls = (n, radius) => {
//     for(let i = 0;i<n;i++){
//         const angle1 = (2 * Math.PI) * (i / n)
//         const angle2 = (2 * Math.PI) * ((i + 1) / n)
    
//         const x1 = radius * Math.cos(angle1)
//         const y1 = radius * Math.sin(angle1)
//         const x2 = radius * Math.cos(angle2)
//         const y2 = radius * Math.sin(angle2)

//         const height = 2 * radius * Math.sin(Math.PI / n)
    
//         const hue = Math.floor(360 * (i / (n + 1)))
//         const color = `hsl(${hue}, 100%, 50%)`
    
//         walls.push({
//             x1,
//             y1,
//             x2,
//             y2,
//             height,
//             color
//         })
//     }
// }

// generateRegularPolygonWalls(10, 5)

const calculateHit = (theta, wall) => {
    let distance

    const vx = Math.cos(theta)
    const vy = Math.sin(theta)

    if(wall.x1 == wall.x2){
        if (vx == 0) return null

        distance = (wall.y1 - player.y) / vx
    } else {
        const m = (wall.y2 - wall.y1) / (wall.x2 - wall.x1)

        if (vy - m * vx == 0) return null

        distance = (m * player.x - m * wall.x1 - player.y + wall.y1) / (vy - m * vx)
    }

    const px = player.x + vx * distance
    const py = player.y + vy * distance

    if(px + 0.0001 < Math.min(wall.x1, wall.x2)) return null
    if(px - 0.0001 > Math.max(wall.x1, wall.x2)) return null
    if(py + 0.0001 < Math.min(wall.y1, wall.y2)) return null
    if(py - 0.0001 > Math.max(wall.y1, wall.y2)) return null

    return {
        distance,
        height: canvas.width * Math.sin(0.5 * player.fov) * wall.height / distance / Math.cos(player.theta - theta),
        color: wall.color
    }
}

const render = () => {
    ctx.fillStyle = "white"
    ctx.fillRect(0, 0, canvas.width, 0.5 * canvas.height)
    ctx.fillStyle = "rgb(50, 40, 20)"
    ctx.fillRect(0, 0.5 * canvas.height, canvas.width, 0.5 * canvas.height)

    for(let i = 0;i<canvas.width;i++){
        const theta = player.theta + player.fov * (i / canvas.width) - 0.5 * player.fov

        let closestHit = {
            distance: Number.MAX_VALUE,
            height: canvas.height,
            color: false
        }

        walls.forEach((wall) => {
            const hit = calculateHit(theta, wall)

            if(hit != null && hit.distance > 0 && hit.distance < closestHit.distance){
                closestHit = hit
            }
        })

        if(closestHit.color !== false){
            ctx.fillStyle = closestHit.color
            ctx.fillRect(canvas.width - i - 1, 0.5 * (canvas.height - closestHit.height), 1, closestHit.height)
        }
    }
}

window.addEventListener("keydown", (e) => {
    if(e.code == "ArrowLeft"){
        player.theta += 5 * Math.PI / 180
    } else if(e.code == "ArrowRight"){
        player.theta -= 5 * Math.PI / 180
    } else if(e.code == "ArrowUp"){
        player.x += 0.1 * Math.cos(player.theta)
        player.y += 0.1 * Math.sin(player.theta)
    } else if(e.code == "ArrowDown"){
        player.x -= 0.1 * Math.cos(player.theta)
        player.y -= 0.1 * Math.sin(player.theta)
    }

    render()
})

render()