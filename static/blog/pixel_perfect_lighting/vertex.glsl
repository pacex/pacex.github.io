attribute vec3 a_Position;
attribute vec2 a_TexCoord;

uniform mat4 u_model;
uniform mat4 u_view;
uniform mat4 u_projection;

varying vec2 v_TexCoord;

void main() {
    gl_Position = u_projection * u_view * u_model * vec4(a_Position, 1.0);
    v_TexCoord = a_TexCoord;
}