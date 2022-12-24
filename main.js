import * as THREE from "https://cdn.jsdelivr.net/npm/three@0.121.1/build/three.module.js";
import { OrbitControls } from "https://cdn.jsdelivr.net/npm/three@0.121.1/examples/jsm/controls/OrbitControls.js";

/**
 * This function is used to create vertical plank of the boards
 * @param {number} x - x position to render vertical plank
 * @returns {Object} board to be displayed
 */
const createVerticalPlank = (x) => {
  const geometry = new THREE.BoxGeometry(0.3, 5, 0.11);
  const board = new THREE.Mesh(geometry);
  board.position.x = x;

  return board;
};

/**
 * This function is used to create horizontal plank of the boards
 * @param {number} x - x position to render horizontal plank
 * @param {number} y - y position to render horizontal plank
 * @returns {Object} board to be displayed
 */
const createHorizontalPlank = (x, y) => {
  const geometry = new THREE.BoxGeometry(6, 0.3, 0.2);
  const board = new THREE.Mesh(geometry);
  board.position.x = x;
  board.position.y = y;
  board.position.z = -0.12;

  return board;
};

/**
 * This function is used to change position of the light
 * @param {Event} e - inputs event
 * @param {number} index - current element order number
 */
const changeLightPos = (e, index) => {
  const tempPositions = lightPositions;
  tempPositions[index] = e.target.value;
  light.position.set(...tempPositions);
};

const SCENE_WIDTH = window.innerWidth > 800 ? 800 : window.innerWidth;
const SCENE_HEIGHT = 400;

const LIGHT_POSITION = 8;

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(
  SCENE_WIDTH > 400 ? 85 : 105,
  SCENE_WIDTH / SCENE_HEIGHT,
  0.1,
  1000
);

const renderer = new THREE.WebGLRenderer({ antialias: true });
const container = document.getElementById("canvas");

renderer.setSize(SCENE_WIDTH, SCENE_HEIGHT);
container.appendChild(renderer.domElement);

const controls = new OrbitControls(camera, renderer.domElement);
controls.update();

const loader = new THREE.TextureLoader();
const bgTexture = loader.load("bg.jpg");
scene.background = bgTexture;

const TEXTURE_NAMES = ["wood", "wood2"];

const textures = await Promise.all(
  TEXTURE_NAMES.map(
    async (el) => await new THREE.TextureLoader().load(`${el}.jpg`)
  )
);

let [materialTexture] = textures;

const VERTICAL_BOARDS_POSITIONS = [-6, 0, 6];
const verticalBoards = VERTICAL_BOARDS_POSITIONS.map(createVerticalPlank);

const step = 0.35;
const HORIZONTAL_BOARDS_POSITIONS = [-3, 3];

let horizontalBoards = [];

HORIZONTAL_BOARDS_POSITIONS.map((start) => {
  for (let i = -2.4; i <= 2.5; i += step) {
    horizontalBoards.push(createHorizontalPlank(start, i));
  }
});

const singleGeometry = new THREE.Geometry();

verticalBoards.map((vertBoard) => {
  vertBoard.updateMatrix();
  singleGeometry.merge(vertBoard.geometry, vertBoard.matrix);
});

horizontalBoards.map((horizBoard) => {
  horizBoard.updateMatrix();
  singleGeometry.merge(horizBoard.geometry, horizBoard.matrix);
});

const material = new THREE.MeshPhongMaterial({ map: materialTexture });
const mesh = new THREE.Mesh(singleGeometry, material);
mesh.material.map.needsUpdate = true;

scene.add(mesh);

const lightPositions = [LIGHT_POSITION, LIGHT_POSITION, LIGHT_POSITION];

const light = new THREE.PointLight(0xffffff, 2);
light.position.set(...lightPositions);
scene.add(light);

camera.position.z = 5;

// light direction
const lightPickerX = document.querySelector('input[name="lightPickerX"]');
const lightPickerY = document.querySelector('input[name="lightPickerY"]');
const lightPickerZ = document.querySelector('input[name="lightPickerZ"]');

const lightPickers = [lightPickerX, lightPickerZ, lightPickerY];

let changeLightDirection;

lightPickers.map((lightPicker, index) => {
  changeLightDirection = (e) => {
    changeLightPos(e, index);
  };

  lightPicker.addEventListener("change", changeLightDirection);
  lightPicker.addEventListener("input", changeLightDirection);
});

const radioGroup = document.querySelector("#radioGroup");

radioGroup.addEventListener("click", (e) => {
  if (e.target && e.target.name === "texture") {
    mesh.material.map = textures[TEXTURE_NAMES.indexOf(e.target.value)];
  }
});

function animate() {
  requestAnimationFrame(animate);
  renderer.render(scene, camera);
}

animate();
