// NOTE: The contents of this file will only be executed if
// you uncomment its entry in "web/static/js/app.js".

// To use Phoenix channels, the first step is to import Socket
// and connect at the socket path in "lib/my_app/endpoint.ex":
import {Socket} from "deps/phoenix/web/static/js/phoenix"

let socket = new Socket("/socket")

// When you connect, you'll often need to authenticate the client.
// For example, imagine you have an authentication plug, `MyAuth`,
// which authenticates the session and assigns a `:current_user`.
// If the current user exists you can assign the user's token in
// the connection for use in the layout.
//
// In your "web/router.ex":
//
//     pipeline :browser do
//       ...
//       plug MyAuth
//       plug :put_user_token
//     end
//
//     defp put_user_token(conn, _) do
//       if current_user = conn.assigns[:current_user] do
//         token = Phoenix.Token.sign(conn, "user socket", current_user.id)
//         assign(conn, :user_token, token)
//       else
//         conn
//       end
//     end
//
// Now you need to pass this token to JavaScript. You can do so
// inside a script tag in "web/templates/layout/app.html.eex":
//
//     <script>window.userToken = "<%= assigns[:user_token] %>";</script>
//
// You will need to verify the user token in the "connect/2" function
// in "web/channels/user_socket.ex":
//
//     def connect(%{"token" => token}, socket) do
//       # max_age: 1209600 is equivalent to two weeks in seconds
//       case Phoenix.Token.verify(socket, "user socket", token, max_age: 1209600) do
//         {:ok, user_id} ->
//           {:ok, assign(socket, :user, user_id)}
//         {:error, reason} ->
//           :error
//       end
//     end
//
// Finally, pass the token on connect as below. Or remove it
// from connect if you don't care about authentication.

socket.connect({token: window.userToken})

let $climate = $('.js-climate-data')

var data = {temperature: 80, humidity: 0}

// Now that you are connected, you can join channels with a topic:
let channel = socket.channel("data:climate", {})

channel.join()
  .receive("ok", resp => { console.log("Joined successfully", resp) })
  .receive("error", resp => { console.log("Unable to join", resp) })

channel.on('new_data', payload => {
  let datum = payload.datum
  data = datum
})

let $ambient = $('.js-ambient-data')

// Now that you are connected, you can join channels with a topic:
let ambientChannel = socket.channel("data:ambient", {})
ambientChannel.join()
  .receive("ok", resp => { console.log("Joined successfully", resp) })
  .receive("error", resp => { console.log("Unable to join", resp) })

ambientChannel.on('new_data', payload => {
  let datum = payload.datum
  $ambient.append( $('<li>', {text: `light: ${datum.light}, sound: ${datum.sound}`}) )
})

function rand(min, max) {
  return (Math.random() * (max - min) + min)|0
}
var MAX_CIRCLES = 100
var X_VEL = 3
var Y_VEL = 3
var MIN_COLOR = 0
var MAX_COLOR = 50
var MIN_R = 200
var MAX_R = 400
var MIN_TTL = 200
var MAX_TTL = 600

function Circle(x, y, r) {
  this.x     = 400
  this.y     = 600
  this.r     = rand(MIN_R, MAX_R)
  this.color = (data.temperature * 2.5) + rand(MIN_COLOR, MAX_COLOR)
  this.xVel  = rand(-X_VEL, X_VEL)
  this.yVel  = rand(-Y_VEL, Y_VEL)
  this.alive = true
  this.aliveCount = 0
  this.ttl = rand(MIN_TTL, MAX_TTL)
}
Circle.prototype.draw = function(ctx) {
  ctx.fillStyle = ctx.strokeStyle = this.colorString()
  ctx.beginPath();
  ctx.arc(this.x, this.y, this.r, 0, Math.PI*2, true)
  ctx.fill();
}
Circle.prototype.colorString = function() {
  return 'hsla(' + this.color + ',100%,48%,' + this.alpha() + ')'
}
Circle.prototype.update = function() {
  this.x += this.xVel
  this.y += this.yVel
  if (this.aliveCount++ > this.ttl) {
    this.alive = false
  }
}
Circle.prototype.alpha = function() {
  if (this.aliveCount < (this.ttl / 2) )
    return ((this.ttl / (this.aliveCount * 100)) - 100) / 100
  else
    return (((this.aliveCount * this.ttl)) - 100) / 100
}
Circle.prototype.isAlive = function() {
  return !!this.alive
}
var isPlaying = true
var isMouseVisible = false
var mousePos = { x: 0, y: 0 }
var circles = []
var can = document.getElementById('webgl-canvas')
var cw = can.width = can.offsetWidth * devicePixelRatio;
var ch = can.height = can.offsetHeight * devicePixelRatio;
var ctx = can.getContext('2d');
ctx.scale(devicePixelRatio, devicePixelRatio)

function draw() {
  circles.forEach(function(circle) {
    circle.draw(ctx);
  })
}
function clear() {
  // ctx.clearRect(0, 0, cw, ch)
}
function update() {
  if (circles.length < MAX_CIRCLES)
    circles.push( new Circle(data.temperature, data.humidity, 50) )
  circles.forEach(function(circle) {
    circle.update()
  })
  circles = circles.filter(function(circle) {
    return circle.isAlive()
  })
}

function animLoop() {
  if (isPlaying) {
    clear()
    update()
    draw( ctx )
  }
  requestAnimationFrame( animLoop )
}

animLoop()

export default socket
