let GL = -1
let CANVAS = -1

// Load shaders

let PROGRAM = -1

async function loadShaderSource(url){
    const response = await fetch(url + '?nocache=' + Date.now);
    if (!response.ok){
        throw new Error(`Failed to load ${url}: ${response.statusText}`);
    }
    return await response.text()
}

async function initShaders(vertexPath, fragmentPath){

    if (GL < 0){
        alert("GL context not initialized.")
        return -1
    }

    var vertexSource = await loadShaderSource(vertexPath);
    var fragmentSource = await loadShaderSource(fragmentPath);

    console.log("Vertex source:")
    console.log(vertexSource)

    console.log("Fragment source:")
    console.log(fragmentSource)

    // Create and compile shaders
    var vertexShader = GL.createShader(GL.VERTEX_SHADER);
    GL.shaderSource(vertexShader, vertexSource);
    GL.compileShader(vertexShader);

    var fragmentShader = GL.createShader(GL.FRAGMENT_SHADER);
    GL.shaderSource(fragmentShader, fragmentSource);
    GL.compileShader(fragmentShader);

    if (!GL.getShaderParameter(vertexShader, GL.COMPILE_STATUS)){
        alert("Error compiling vertex shader: " + GL.getShaderInfoLog(vertexShader));
        return -1;
    }
    if (!GL.getShaderParameter(fragmentShader, GL.COMPILE_STATUS)){
        alert("Error compiling fragment shader: " + GL.getShaderInfoLog(fragmentShader));
        return -1;
    }

    var glProgram = GL.createProgram();

    // Link shaders
    GL.attachShader(glProgram, vertexShader)
    GL.attachShader(glProgram, fragmentShader)
    GL.linkProgram(glProgram)

    if (!GL.getProgramParameter(glProgram, GL.LINK_STATUS)) {
        alert("Unable to initialize the shader program");
        return -1;
    }

    // Use program
    GL.useProgram(glProgram);

    return glProgram;
}

// Bind Vertex Buffer Object
function bindVertexBuffers() {

    if (GL < 0){
        alert("GL context not initialized.")
        return -1
    }

    const vertices = new Float32Array([
        -0.5, -0.5,  0.5, 0, 1,
        0.5, -0.5,  0.5, 1, 1,
        0.5,  0.5,  0.5, 1, 0,
        -0.5,  0.5,  0.5, 0, 0,
        -0.5, -0.5, -0.5, 1, 1,
        -0.5,  0.5, -0.5, 1, 0,
        0.5,  0.5, -0.5, 0, 0,
        0.5, -0.5, -0.5, 0, 1,
        -0.5,  0.5, -0.5, 0, 0,
        -0.5,  0.5,  0.5, 0, 1,
        0.5,  0.5,  0.5, 1, 1,
        0.5,  0.5, -0.5, 1, 0,
        -0.5, -0.5, -0.5, 0, 0,
        0.5, -0.5, -0.5, 1, 0,
        0.5, -0.5,  0.5, 1, 1,
        -0.5, -0.5,  0.5, 0, 1,
        0.5, -0.5, -0.5, 1, 1,
        0.5,  0.5, -0.5, 1, 0,
        0.5,  0.5,  0.5, 0, 0,
        0.5, -0.5,  0.5, 0, 1,
        -0.5, -0.5, -0.5, 0, 1,
        -0.5, -0.5,  0.5, 1, 1,
        -0.5,  0.5,  0.5, 1, 0,
        -0.5,  0.5, -0.5, 0, 0
    ]);

    const indices = new Uint16Array([
        0, 1, 2, 0, 2, 3,
        4, 5, 6, 4, 6, 7,
        8, 9,10, 8,10,11,
        12,13,14,12,14,15,
        16,17,18,16,18,19,
        20,21,22,20,22,23
    ]);

    // Create a buffer object
    const vertexBuffer = GL.createBuffer();
    GL.bindBuffer(GL.ARRAY_BUFFER, vertexBuffer);
    GL.bufferData(GL.ARRAY_BUFFER, vertices, GL.STATIC_DRAW);

    const indexBuffer = GL.createBuffer();
    GL.bindBuffer(GL.ELEMENT_ARRAY_BUFFER, indexBuffer)
    GL.bufferData(GL.ELEMENT_ARRAY_BUFFER, indices, GL.STATIC_DRAW)

    // Assign the vertices in buffer object to a_Position variable
    const stride = 5 * Float32Array.BYTES_PER_ELEMENT;

    GL.vertexAttribPointer(0, 3, GL.FLOAT, false, stride, 0);
    GL.enableVertexAttribArray(0);

    GL.vertexAttribPointer(1, 2, GL.FLOAT, false, stride, 3 * Float32Array.BYTES_PER_ELEMENT)
    GL.enableVertexAttribArray(1);

    // Return number of vertices
    return indices.length;
}

let N_VERTICES = -1

async function init(){
    // Get canvas
    CANVAS = document.getElementById("cubeUVs");

    // Init WebGL
    GL = CANVAS.getContext("webgl");
    if (!GL){
        console.log("Failed to get the WebGL rendering context!")
        return;
    }

    // Init shaders
    PROGRAM = await initShaders( '/blog/pixel_perfect_lighting/vertex.glsl', '/blog/pixel_perfect_lighting/fragment.glsl')
    if (PROGRAM < 0){
        console.log("Failed to initialize shaders!")
        return;
    }

    // Settings
    GL.enable(GL.CULL_FACE)

    // Write the positions of vertices to a vertex shader
    N_VERTICES = bindVertexBuffers();

    requestAnimationFrame(tick)
}

function tick(currentTime){

    if (CANVAS < 0){
        alert("Canvas not initialized.")
        return -1
    }
    
    if (GL < 0){
        alert("GL context not initialized.")
        return -1
    }

    if (PROGRAM < 0){
        alert("Shaders not initialized.")
        return -1
    }

    GL.clearColor(1.0, 1.0, 1.0, 1.0);
    GL.clear(GL.COLOR_BUFFER_BIT);

    const m4 = glMatrix.mat4
    const model = m4.create();
    m4.translate(model, model, [0, 0, 0]);
    m4.rotateY(model, model, currentTime * 0.001);

    const view = m4.create();
    m4.lookAt(view,
    [0, 1, 2.5], 
    [0, 0, 0],
    [0, 1, 0]
    );

    const projection = m4.create();
    m4.perspective(projection,
    Math.PI / 4,
    CANVAS.width / CANVAS.height,
    0.1,
    100.0
    );

    // Draw
    GL.uniformMatrix4fv(GL.getUniformLocation(PROGRAM, "u_model"), false, model)
    GL.uniformMatrix4fv(GL.getUniformLocation(PROGRAM, "u_view"), false, view)
    GL.uniformMatrix4fv(GL.getUniformLocation(PROGRAM, "u_projection"), false, projection)

    GL.drawElements(GL.TRIANGLES, N_VERTICES, GL.UNSIGNED_SHORT, 0)


    requestAnimationFrame(tick)
}