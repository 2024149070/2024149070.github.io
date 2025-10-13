export class SquarePyramid {
    constructor(gl){
        this.gl = gl;

        this.vao = gl.createVertexArray();
        this.vbo = gl.createBuffer();
        this.ebo = gl.createBuffer();

    this.vertices = new Float32Array([
        0.0, 1.0, 0.0 , -0.5, 0.0, 0.5, 0.5, 0.0, 0.5,
        0.0, 1.0, 0.0 ,  0.5, 0.0, 0.5, 0.5, 0.0, -0.5,
        0.0, 1.0, 0.0 , 0.5, 0.0, -0.5, -0.5, 0.0, -0.5,
        0.0, 1.0, 0.0 , -0.5, 0.0, -0.5, -0.5, 0.0, 0.5,
        0.5, 0.0, 0.5 , -0.5, 0.0, 0.5, -0.5, 0.0, -0.5,
        -0.5, 0.0, -0.5 , 0.5, 0.0, -0.5, 0.5, 0.0, 0.5,

    ])
    this.colors = new Float32Array([
                // front face (v0,v1,v2,v3) - red
                1, 0, 0, 1,   1, 0, 0, 1,   1, 0, 0, 1,   
                // right face (v0,v3,v4,v5) - yellow
                1, 1, 0, 1,   1, 1, 0, 1,   1, 1, 0, 1,   
                // top face (v0,v5,v6,v1) - green
                1, 0, 1, 1,   1, 0, 1, 1,   1, 0, 1, 1,   
                // left face (v1,v6,v7,v2) - cyan
                0, 1, 1, 1,   0, 1, 1, 1,   0, 1, 1, 1,   
                // bottom face (v7,v4,v3,v2) - blue
                0, 1, 0, 1,   0, 1, 0, 1,   0, 1, 0, 1,

                0, 1, 0, 1,   0, 1, 0, 1,   0, 1, 0, 1,
    ]);
    this.indices = new Uint16Array([
            // front face
            0, 1, 2,   
            3, 4, 5,
            6, 7, 8,
            9, 10 ,11,
            12, 13, 14,
            15, 16, 17      // v0-v1-v2, v2-v3-v0
     ]);
     this.initBuffers();
    }


    initBuffers() {
        const gl = this.gl;

        const vSize = this.vertices.byteLength;
        const cSize = this.colors.byteLength;

        gl.bindVertexArray(this.vao);


        gl.bindBuffer(gl.ARRAY_BUFFER, this.vbo);
        gl.bufferData(gl.ARRAY_BUFFER, vSize+cSize, gl.STATIC_DRAW);

        gl.bufferSubData(gl.ARRAY_BUFFER, 0, this.vertices);
        gl.bufferSubData(gl.ARRAY_BUFFER, vSize, this.colors);

        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.ebo);
        gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, this.indices, gl.STATIC_DRAW);
        
        gl.vertexAttribPointer(0, 3, gl.FLOAT, false, 0, 0);  // position
        gl.vertexAttribPointer(1, 4, gl.FLOAT, false, 0, vSize);  // color

        gl.enableVertexAttribArray(0);
        gl.enableVertexAttribArray(1);

        gl.bindBuffer(gl.ARRAY_BUFFER, null);
        gl.bindVertexArray(null);
    }

    draw(shader) {

        const gl = this.gl;
        shader.use();
        gl.bindVertexArray(this.vao);
        gl.drawElements(gl.TRIANGLES, 18, gl.UNSIGNED_SHORT, 0);
        gl.bindVertexArray(null);
    }
    

}