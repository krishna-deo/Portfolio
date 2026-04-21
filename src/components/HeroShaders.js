export const vertexShader = `

varying vec2 vUv;

void main() {

  vUv = uv;

  gl_Position =
    projectionMatrix *
    modelViewMatrix *
    vec4(position, 1.0);

}
`;


export const fragmentShader = `

uniform sampler2D uTexture1;

uniform vec2 uResolution;
uniform vec2 uImageResolution;

varying vec2 vUv;

void main() {

  // Maintain image aspect ratio
  vec2 ratio = vec2(

    min(
      (uResolution.x / uResolution.y) /
      (uImageResolution.x / uImageResolution.y),
      1.0
    ),

    min(
      (uResolution.y / uResolution.x) /
      (uImageResolution.y / uImageResolution.x),
      1.0
    )

  );

  vec2 centeredUv = vUv - vec2(0.5);

  vec2 uvCover =
    centeredUv * ratio + vec2(0.5);

  vec4 color =
    texture2D(uTexture1, uvCover);

  gl_FragColor = color;

}
`;