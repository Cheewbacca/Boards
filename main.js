import * as THREE from "https://cdn.jsdelivr.net/npm/three@0.121.1/build/three.module.js";
import { OrbitControls } from "https://cdn.jsdelivr.net/npm/three@0.121.1/examples/jsm/controls/OrbitControls.js";

class Board1 {
  constructor() {
    this.VERTICAL_BOARDS_POSITIONS = [-6, 0, 6];
    this.HORIZONTAL_BOARDS_POSITIONS = [-3, 3];
    this.step = 0.31;
  }

  createVerticalPlank(x) {
    const geometry = new THREE.BoxGeometry(0.3, 5, 0.11);
    const board = new THREE.Mesh(geometry);
    board.position.x = x;

    return board;
  }

  createHorizontalPlank(x, y) {
    const geometry = new THREE.BoxGeometry(6, 0.3, 0.2);
    const board = new THREE.Mesh(geometry);
    board.position.x = x;
    board.position.y = y;
    board.position.z = -0.12;

    return board;
  }

  createGeometry() {
    const singleGeometry = new THREE.Geometry();

    this.VERTICAL_BOARDS_POSITIONS.map(this.createVerticalPlank).map(
      (vertBoard) => {
        vertBoard.updateMatrix();
        singleGeometry.merge(vertBoard.geometry, vertBoard.matrix);
      }
    );

    let horizontalBoards = [];

    this.HORIZONTAL_BOARDS_POSITIONS.map((start) => {
      for (let i = -2.4; i <= 2.5; i += this.step) {
        horizontalBoards.push(this.createHorizontalPlank(start, i));
      }
    });

    horizontalBoards.map((horizBoard) => {
      horizBoard.updateMatrix();
      singleGeometry.merge(horizBoard.geometry, horizBoard.matrix);
    });

    return singleGeometry;
  }
}

class Board2 {
  constructor() {
    this.HORIZONTAL_BOARDS_POSITIONS = [-3, -3, 3, 3];
    this.VERTICAL_BOARDS_POSITIONS = [-6, 0, 6];
    this.VERTICAL_SECONDARY_BOARDS_POSITIONS = [-6, 6];
    this.TOP_BOARDS = [-3, 3];
    this.step = 0.25;
  }

  createVerticalPlank(x) {
    const geometry = new THREE.BoxGeometry(0.3, 5, 0.5);
    const board = new THREE.Mesh(geometry);
    board.position.x = x;

    return board;
  }

  createVerticalSecondaryPlank(x, i) {
    const geometry = new THREE.BoxGeometry(0.3, 4.9, 0.11);
    const board = new THREE.Mesh(geometry);
    board.position.y = -0.05;
    board.position.x = x;
    board.position.z = i % 2 === 0 ? -0.15 : -0.07;

    return board;
  }

  createHorizontalPlank(x, i) {
    const geometry = new THREE.BoxGeometry(6, 0.3, 0.2);
    const board = new THREE.Mesh(geometry);
    board.position.x = x;
    board.position.y = i % 2 === 0 ? -2 : 2.25;

    return board;
  }

  createTopBoard(x) {
    const geometry = new THREE.BoxGeometry(5.75, 0.1, 0.5);
    const board = new THREE.Mesh(geometry);
    board.position.x = x;
    board.position.y = 2.4;
    return board;
  }

  createGeometry() {
    const singleGeometry = new THREE.Geometry();

    this.VERTICAL_BOARDS_POSITIONS.map(this.createVerticalPlank).map(
      (vertBoard) => {
        vertBoard.updateMatrix();
        singleGeometry.merge(vertBoard.geometry, vertBoard.matrix);
      }
    );

    let horizontalBoards = [];
    let index = 0;

    for (let i = -6; i <= 6; i += this.step) {
      horizontalBoards.push(this.createVerticalSecondaryPlank(i, index));
      index += 1;
    }

    horizontalBoards.map((horizBoard) => {
      horizBoard.updateMatrix();
      singleGeometry.merge(horizBoard.geometry, horizBoard.matrix);
    });

    this.HORIZONTAL_BOARDS_POSITIONS.map(this.createHorizontalPlank).map(
      (horizBoard) => {
        horizBoard.updateMatrix();
        singleGeometry.merge(horizBoard.geometry, horizBoard.matrix);
      }
    );

    this.TOP_BOARDS.map(this.createTopBoard).map((topBoard) => {
      topBoard.updateMatrix();
      singleGeometry.merge(topBoard.geometry, topBoard.matrix);
    });

    return singleGeometry;
  }
}

class Board3 extends Board2 {
  constructor() {
    super();
    this.step = 0.41;
  }

  createVerticalSecondaryPlank(x, i) {
    const geometry = new THREE.BoxGeometry(0.4, 4.9, 0.11);
    const board = new THREE.Mesh(geometry);
    board.position.y = -0.05;
    board.position.x = x;
    board.position.z = -0.07;

    return board;
  }

  createHorizontalPlank(x, y) {
    const geometry = new THREE.BoxGeometry(6, 0.3, 0.2);
    const board = new THREE.Mesh(geometry);
    board.position.x = x;
    board.position.y = y;

    return board;
  }

  createGeometry() {
    const singleGeometry = new THREE.Geometry();

    this.VERTICAL_BOARDS_POSITIONS.map(super.createVerticalPlank).map(
      (vertBoard) => {
        vertBoard.updateMatrix();
        singleGeometry.merge(vertBoard.geometry, vertBoard.matrix);
      }
    );

    let horizontalBoards = [];
    let index = 0;

    for (let i = -6; i <= 6; i += this.step) {
      horizontalBoards.push(this.createVerticalSecondaryPlank(i, index));
      index += 1;
    }

    horizontalBoards.map((horizBoard) => {
      horizBoard.updateMatrix();
      singleGeometry.merge(horizBoard.geometry, horizBoard.matrix);
    });

    this.HORIZONTAL_BOARDS_POSITIONS.map((el, index) =>
      this.createHorizontalPlank(el, index % 2 === 0 ? -2 : 2.25)
    ).map((horizBoard) => {
      horizBoard.updateMatrix();
      singleGeometry.merge(horizBoard.geometry, horizBoard.matrix);
    });

    [-3, 3]
      .map((el) => this.createHorizontalPlank(el, 0))
      .map((horizBoard) => {
        horizBoard.updateMatrix();
        singleGeometry.merge(horizBoard.geometry, horizBoard.matrix);
      });

    this.TOP_BOARDS.map(super.createTopBoard).map((topBoard) => {
      topBoard.updateMatrix();
      singleGeometry.merge(topBoard.geometry, topBoard.matrix);
    });

    return singleGeometry;
  }
}

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

const SCENE_WIDTH = window.innerWidth >= 800 ? 800 : window.innerWidth - 18;
const SCENE_HEIGHT = 400;

const LIGHT_POSITION = 8;

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(
  SCENE_WIDTH > 500 ? 85 : 115,
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
const bgTexture = loader.load("./images/bg.jpg");
scene.background = bgTexture;

const TEXTURE_NAMES = ["wood", "wood2"];

const textures = await Promise.all(
  TEXTURE_NAMES.map(
    async (el) => await new THREE.TextureLoader().load(`./images/${el}.jpg`)
  )
);

let [materialTexture] = textures;

const board1 = new Board1().createGeometry();
const board2 = new Board2().createGeometry();
const board3 = new Board3().createGeometry();

const BOARDS = [board1, board2, board3];

const singleGeometry = board1;

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

document.querySelector("#select").addEventListener("change", (e) => {
  mesh.geometry = BOARDS[+e.target.value];
});

function animate() {
  requestAnimationFrame(animate);
  renderer.render(scene, camera);
}

animate();
