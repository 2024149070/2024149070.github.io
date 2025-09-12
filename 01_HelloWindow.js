// Global constants
const canvas = document.getElementById('glCanvas'); // Get the canvas element 
const gl = canvas.getContext('webgl2'); // Get the WebGL2 context

if (!gl) {
    console.error('WebGL 2 is not supported by your browser.');
}

// Set canvas size: 현재 window 전체를 canvas로 사용
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

// Initialize WebGL settings: viewport and clear color

gl.enable(gl.SCISSOR_TEST);

gl.viewport(0, 0, canvas.width/2, canvas.height);
gl.scissor(0, 0, canvas.width/2, canvas.height);
gl.clearColor(1, 0, 0, 1);  // red
render();

gl.viewport(canvas.width/2, canvas.width/2, canvas.width/2, canvas.height);
gl.scissor(canvas.width/2, canvas.width/2, canvas.width/2, canvas.height);
gl.clearColor(1, 1, 0, 1);  // red
render();

// Render loop
function render() {
    gl.clear(gl.COLOR_BUFFER_BIT);    
    // Draw something here
}

// Resize viewport when window size changes
window.addEventListener('resize', () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    gl.viewport(0, 0, canvas.width, canvas.height);
    render();
});

