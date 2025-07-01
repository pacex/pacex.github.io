async function loadShaderSource(url){
    const response = await fetch(url);
    if (!response.ok){
        throw new Error(`Failed to load ${url}: ${response.statusText}`);
    }
    return await response.text()
}

async function initShaders(gl, vertexPath, fragmentPath){

    var vertexSource = await loadShaderSource(vertexPath);
    var fragmentSource = await loadShaderSource(fragmentPath);

    // Create and compile shaders
    var vertexShader = gl.createShader(gl.VERTEX_SHADER);
    gl.shaderSource(vertexShader, vertexSource);
    gl.compileShader(vertexShader);

    var fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);
    gl.shaderSource(fragmentShader, fragmentSource);
    gl.compileShader(fragmentShader);

    if (!gl.getShaderParameter(vertexShader, gl.COMPILE_STATUS)){
        alert("Error compiling vertex shader: " + gl.getShaderInfoLog(vertexShader));
        return;
    }
    if (!gl.getShaderParameter(fragmentShader, gl.COMPILE_STATUS)){
        alert("Error compiling fragment shader: " + gl.getShaderInfoLog(fragmentShader));
        return;
    }

    var glProgram = gl.createProgram();

    // Link shaders
    gl.attachShader(glProgram, vertexShader)
    gl.attachShader(glProgram, fragmentShader)
    gl.linkProgram(glProgram)

    if (!gl.getProgramParameter(glProgram, gl.LINK_STATUS)) {
        alert("Unable to initialize the shader program");
        return false;
    }

    // Use program
    gl.useProgram(glProgram);

    return true;
}

 function initVertexBuffers(gl) {
        // Vertices
        var dim = 3;
        var vertices = new Float32Array([
            0, 0.5, 0,  // Vertice #1
            -0.5, -0.5, 0, // Vertice #2
            0.5, -0.5, 0 // Vertice #3
        ]);

        // Create a buffer object
        var vertexBuffer = gl.createBuffer();
        if (!vertexBuffer) {
            console.log('Failed to create the buffer object');
            return -1;
        }
        gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);

        // Assign the vertices in buffer object to a_Position variable
        gl.vertexAttribPointer(0, dim, gl.FLOAT, false, 0, 0);
        gl.enableVertexAttribArray(0);

        // Return number of vertices
        return vertices.length / dim;
    }

async function init(){
    // Get canvas
    const canvas = document.getElementById("cubeUVs");

    // Init WebGL
    const gl = canvas.getContext("webgl");
    if (!gl){
        console.log("Failed to get the WebGL rendering context!")
        return;
    }

    // Init shaders
    if (!await initShaders(gl, '/blog/pixel_perfect_lighting/vertex.glsl', '/blog/pixel_perfect_lighting/fragment.glsl')){
        console.log("Failed to initialize shaders!")
        return;
    }


    // Write the positions of vertices to a vertex shader
    var n = initVertexBuffers(gl);
    if (n < 0) {
        console.log('Failed to set the positions of the vertices');
        return;
    }

    // Clear canvas
    gl.clearColor(1.0, 1.0, 1.0, 1.0);
    gl.clear(gl.COLOR_BUFFER_BIT);

    // Draw
    gl.drawArrays(gl.TRIANGLES, 0, n);
}