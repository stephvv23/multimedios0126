/**
 * Clase que gestiona el estado y la lógica de negocio de la Calculadora.
 */
class Calculator {
    constructor(historyElement, outputElement) {
        this.historyElement = historyElement;
        this.outputElement = outputElement;
        this.clear();
    }

    /**
     * Restablece la calculadora a su estado inicial.
     */
    clear() {
        this.currentOperand = '0';
        this.previousOperand = '';
        this.operation = undefined;
        this.shouldResetScreen = false;
        this.updateDisplay();
    }

    /**
     * Agrega un número a la pantalla validando condiciones.
     * @param {string} number 
     */
    appendNumber(number) {
        // Si hay un error en pantalla o se debe reiniciar tras un cálculo
        if (this.currentOperand === 'Error' || this.shouldResetScreen) {
            this.currentOperand = '';
            this.shouldResetScreen = false;
        }

        // Evitar múltiples ceros a la izquierda iniciales
        if (number === '0' && this.currentOperand === '0') return;
        
        // Si está en '0' inicial y se presiona otro número, reemplazarlo
        if (this.currentOperand === '0' && number !== '.') {
            this.currentOperand = '';
        }

        this.currentOperand = this.currentOperand.toString() + number.toString();
        this.updateDisplay();
    }

    /**
     * Agrega el punto decimal validando que no exista ya uno en el operando actual.
     */
    appendDecimal() {
        if (this.shouldResetScreen || this.currentOperand === 'Error') {
            this.currentOperand = '0';
            this.shouldResetScreen = false;
        }
        
        // Validación obligatoria: Evitar múltiples puntos decimales
        if (this.currentOperand.includes('.')) return;
        
        this.currentOperand = this.currentOperand.toString() + '.';
        this.updateDisplay();
    }

    /**
     * Selecciona la operación aritmética a realizar.
     * @param {string} operator 
     */
    chooseOperation(operator) {
        if (this.currentOperand === 'Error') return;
        
        // Si ya hay un operador seleccionado y el usuario presiona otro, calculamos primero
        if (this.previousOperand !== '') {
            this.calculate();
        }

        // Validar entrada vacía o errónea antes de asignar operador
        if (this.currentOperand === '' || this.currentOperand === 'Error') return;

        this.operation = operator;
        this.previousOperand = this.currentOperand;
        this.currentOperand = '';
        this.updateDisplay();
    }

    /**
     * Ejecuta el cálculo matemático basado en los operandos y el operador guardado.
     */
    calculate() {
        let computation;
        const prev = parseFloat(this.previousOperand);
        const current = parseFloat(this.currentOperand);

        // Validación de entradas vacías o inputs no numéricos
        if (isNaN(prev) || isNaN(current)) return;

        switch (this.operation) {
            case '+':
                computation = prev + current;
                break;
            case '-':
                computation = prev - current;
                break;
            case '*':
                computation = prev * current;
                break;
            case '/':
                // Validación obligatoria: Evitar divisiones por cero
                if (current === 0) {
                    this.currentOperand = 'Error';
                    this.previousOperand = '';
                    this.operation = undefined;
                    this.shouldResetScreen = true;
                    this.updateDisplay();
                    return;
                }
                computation = prev / current;
                break;
            default:
                return;
        }

        // Validación obligatoria: Evitar resultados NaN finales
        if (isNaN(computation)) {
            this.currentOperand = 'Error';
        } else {
            // Se formatea el número para limitar problemas de precisión de punto flotante en JS
            this.currentOperand = parseFloat(computation.toFixed(10)).toString();
        }
        
        this.operation = undefined;
        this.previousOperand = '';
        this.shouldResetScreen = true;
        this.updateDisplay();
    }

    /**
     * Renderiza el estado de la lógica interna en el DOM de la aplicación.
     */
    updateDisplay() {
        this.outputElement.innerText = this.currentOperand;
        
        if (this.operation != null) {
            this.historyElement.innerText = `${this.previousOperand} ${this.operation}`;
        } else {
            this.historyElement.innerText = '';
        }
    }
}

// --- Inicialización y Vinculación de Eventos (DOM) ---
document.addEventListener('DOMContentLoaded', () => {
    const operationHistory = document.getElementById('operation-history');
    const currentOutput = document.getElementById('current-output');

    // Instancia de nuestra clase controladora
    const calculator = new Calculator(operationHistory, currentOutput);

    // 1. Eventos mediante QuerySelectors masivos y addEventListener()
    document.querySelectorAll('.btn-number').forEach(button => {
        button.addEventListener('click', () => {
            calculator.appendNumber(button.getAttribute('data-number'));
        });
    });

    document.querySelectorAll('.btn-operator').forEach(button => {
        button.addEventListener('click', () => {
            calculator.chooseOperation(button.getAttribute('data-operator'));
        });
    });

    // 2. Eventos utilizando atributos directos e interactividad limpia
    const decimalButton = document.querySelector('.btn-decimal');
    decimalButton.addEventListener('click', () => {
        calculator.appendDecimal();
    });

    const clearButton = document.querySelector('.btn-clear');
    clearButton.addEventListener('click', () => {
        calculator.clear();
    });

    const equalButton = document.querySelector('.btn-equal');
    equalButton.addEventListener('click', () => {
        calculator.calculate();
    });
});