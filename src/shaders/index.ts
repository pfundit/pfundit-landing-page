/**
 * GLSL Shaders for React Three Fiber
 * Cinematic visual effects using Three.js
 */

// Vertex shader for animated background
export const vertexShader = `
  uniform float time;
  uniform float amplitude;
  
  varying vec2 vUv;
  varying float vNoise;
  
  // Simplex noise implementation
  float noise(vec3 p) {
    return sin(p.x * 10.0 + time * 0.5) * sin(p.y * 10.0) * sin(p.z * 10.0);
  }
  
  void main() {
    vUv = uv;
    
    vec3 pos = position;
    float noiseVal = noise(pos) * amplitude;
    
    pos.z += noiseVal;
    vNoise = noiseVal;
    
    gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
  }
`;

// Fragment shader for animated background
export const fragmentShader = `
  uniform float time;
  
  varying vec2 vUv;
  varying float vNoise;
  
  void main() {
    vec3 color = vec3(
      0.1 + 0.2 * sin(vUv.x * 5.0 + time * 0.3),
      0.2 + 0.2 * cos(vUv.y * 5.0 + time * 0.3),
      0.3 + 0.2 * sin((vUv.x + vUv.y) * 5.0 + time * 0.3)
    );
    
    color += vNoise * 0.1;
    
    gl_FragColor = vec4(color, 1.0);
  }
`;

// Vertex shader for particle system
export const particleVertexShader = `
  uniform float time;
  
  attribute float scale;
  attribute vec3 velocity;
  
  void main() {
    vec3 pos = position + velocity * time;
    
    gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
    gl_PointSize = scale * (300.0 / -mvPosition.z);
  }
`;

// Fragment shader for particles
export const particleFragmentShader = `
  uniform sampler2D texture;
  
  void main() {
    gl_FragColor = texture2D(texture, gl_PointCoord);
  }
`;

// Glow fragment shader
export const glowFragmentShader = `
  uniform float time;
  
  varying vec2 vUv;
  
  void main() {
    float dist = length(vUv - 0.5);
    float glow = exp(-dist * dist * 3.0) * 0.8;
    
    vec3 color = vec3(
      0.0 + 0.5 * sin(time * 0.5),
      0.7 + 0.3 * cos(time * 0.3),
      1.0
    );
    
    gl_FragColor = vec4(color * glow, glow);
  }
`;
