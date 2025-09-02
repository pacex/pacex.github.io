precision mediump float;

varying vec2 v_TexCoord;

void main() {
    gl_FragColor = vec4(v_TexCoord, 0.0, 1.0);
}