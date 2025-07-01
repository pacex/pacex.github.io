#version 300 es
layout(location = 0) vec4 a_Position;

void main() {
    gl_Position = a_Position;
}