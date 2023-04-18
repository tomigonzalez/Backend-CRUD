import fs from "fs";
import { get, save } from "./filesMethods.js";
import inquirer from "inquirer";
import { promptNewGasto } from "./gastosPrompts.js";

const main = async () => {
  let go = true;
  while (go) {
    const action = await inquirer.prompt([
      {
        type: "list",
        name: "chose",
        message: "Actions:",
        choices: [
          { value: 1, name: "Get all users" },
          { value: 2, name: "Create new user" },
          { value: 3, name: "Total spends" },
          { value: 4, name: "Total spends by category" },
          { value: 99, name: "EXIT" },
        ],
      },
    ]);
    console.log(action);
    switch (action.chose) {
      case 1:
        await getAllGastos();
        break;
      case 2:
        await createNewGastos();
        break;
      case 3:
        await totalSpends();
        break;
      case 4:
        await totalSpendsByCategory();
        break;
      case 99:
        go = false;
      default:
        go = false;
    }
  }
  console.log("bye");
};

main();

async function createNewGastos() {
  console.log("Adding new user:");
  const newGastosData = await promptNewGasto();

  console.log("asdas", newGastosData);

  const currentGastos = await get("gastos");

  currentGastos.push(newGastosData);
  await save("gastos", currentGastos);
}

async function getAllGastos() {
  const currentGastos = await get("gastos");
  console.log(currentGastos);
}

async function totalSpends() {
  const currentGastos = await get("gastos");
  const total = currentGastos.reduce((acc, gastos) => {
    const monto = parseFloat(gastos.monto);
    return isNaN(monto) ? acc : acc + monto;
  }, 0);
  console.log(`El total de gastos es: $${total}`);
}

async function totalSpendsByCategory() {
  const currentGastos = await get("gastos");
  const totalsByCategory = {};

  currentGastos.forEach((gasto) => {
    const categoria = gasto.categoria;
    const monto = parseFloat(gasto.monto);
    if (!isNaN(monto)) {
      if (totalsByCategory[categoria]) {
        totalsByCategory[categoria] += monto;
      } else {
        totalsByCategory[categoria] = monto;
      }
    }
  });

  console.log("Totales por categoría:");
  for (const categoria in totalsByCategory) {
    console.log(`${categoria}: $${totalsByCategory[categoria]}`);
  }
}
