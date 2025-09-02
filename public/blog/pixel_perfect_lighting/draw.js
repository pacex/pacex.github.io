// Load shaders
async function loadShaderSource(url){
    const response = await fetch(url + '?nocache=' + Date.now);
    if (!response.ok){
        throw new Error(`Failed to load ${url}: ${response.statusText}`);
    }
    return await response.text()
}

async function initShaders(gl, vertexPath, fragmentPath){

    if (gl < 0){
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
    var vertexShader = gl.createShader(gl.VERTEX_SHADER);
    gl.shaderSource(vertexShader, vertexSource);
    gl.compileShader(vertexShader);

    var fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);
    gl.shaderSource(fragmentShader, fragmentSource);
    gl.compileShader(fragmentShader);

    if (!gl.getShaderParameter(vertexShader, gl.COMPILE_STATUS)){
        alert("Error compiling vertex shader: " + gl.getShaderInfoLog(vertexShader));
        return -1;
    }
    if (!gl.getShaderParameter(fragmentShader, gl.COMPILE_STATUS)){
        alert("Error compiling fragment shader: " + gl.getShaderInfoLog(fragmentShader));
        return -1;
    }

    var glProgram = gl.createProgram();

    // Link shaders
    gl.attachShader(glProgram, vertexShader)
    gl.attachShader(glProgram, fragmentShader)
    gl.linkProgram(glProgram)

    if (!gl.getProgramParameter(glProgram, gl.LINK_STATUS)) {
        alert("Unable to initialize the shader program");
        return -1;
    }

    // Use program
    gl.useProgram(glProgram);

    return glProgram;
}

// Bind Vertex Buffer Object
function bindVertexBuffers(gl) {

    if (gl < 0){
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
    const vertexBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);

    const indexBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer)
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, indices, gl.STATIC_DRAW)

    // Assign the vertices in buffer object to a_Position variable
    const stride = 5 * Float32Array.BYTES_PER_ELEMENT;

    gl.vertexAttribPointer(0, 3, gl.FLOAT, false, stride, 0);
    gl.enableVertexAttribArray(0);

    gl.vertexAttribPointer(1, 2, gl.FLOAT, false, stride, 3 * Float32Array.BYTES_PER_ELEMENT)
    gl.enableVertexAttribArray(1);

    // Return number of vertices
    return indices.length;
}

let N_VERTICES = -1

async function init(canvasID){
    // Get canvas
    const canvas = document.getElementById(canvasID);

    // Init WebGL
    const gl = canvas.getContext("webgl");
    if (!gl){
        console.log("Failed to get the WebGL rendering context!")
        return;
    }

    // Init shaders
    const program = await initShaders(gl, '/blog/pixel_perfect_lighting/vertex.glsl', '/blog/pixel_perfect_lighting/fragment.glsl')
    if (program < 0){
        console.log("Failed to initialize shaders!")
        return;
    }

    // Settings
    gl.enable(gl.CULL_FACE)

    // Write the positions of vertices to a vertex shader
    const n_vertices = bindVertexBuffers(gl);

    requestAnimationFrame((t) => tick(t, gl, canvas, program, n_vertices))
}

function tick(currentTime, gl, canvas, program, n_vertices){

    if (canvas < 0){
        alert("Canvas not initialized.")
        return -1
    }
    
    if (gl < 0){
        alert("GL context not initialized.")
        return -1
    }

    if (program < 0){
        alert("Shaders not initialized.")
        return -1
    }

    gl.clearColor(1.0, 1.0, 1.0, 1.0);
    gl.clear(gl.COLOR_BUFFER_BIT);

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
    /*m4.perspective(projection,
                    Math.PI / 4,
                    canvas.width / canvas.height,
                    0.1,
                    100.0
    );*/
    const left = -canvas.width / 2;
    const right = canvas.width / 2;
    const bottom = -canvas.height / 2;
    const top = canvas.height / 2;
    const near = 0.1;
    const far = 100.0;

    const factor = 0.005

    m4.ortho(projection, left * factor, right * factor, bottom * factor, top * factor, near, far);

    

    // Draw
    gl.uniformMatrix4fv(gl.getUniformLocation(program, "u_model"), false, model)
    gl.uniformMatrix4fv(gl.getUniformLocation(program, "u_view"), false, view)
    gl.uniformMatrix4fv(gl.getUniformLocation(program, "u_projection"), false, projection)

    gl.drawElements(gl.TRIANGLES, n_vertices, gl.UNSIGNED_SHORT, 0)


    requestAnimationFrame((t) => tick(t, gl, canvas, program, n_vertices))
}