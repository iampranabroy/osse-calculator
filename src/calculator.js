/**
 * Added operations for actions on UI
 * */

class Calculator {
	/**
	 * Constructor
	 * @param {HTMLElement} operand1TxtDOMNode The DOM node containing the value of the operand 1.
	 * @param {HTMLElement} operand2TxtDOMNode The DOM node containing the value of the operand 2.
	 * @param {HTMLElement} operatorTxtDOMNode The DOM node containing the value of the operator.
	 * @param {HTMLElement} outputTxtDOMNode The DOM node containing the value of the output.
	 */
	constructor(operand1TxtDOMNode, operand2TxtDOMNode, operatorTxtDOMNode, outputTxtDOMNode) {
		/**
		 * The first operand value.
		 * @type {number | null}
		 * @private
		 */
		this._operand1 = null;
		/**
		 * The second operand value.
		 * @type {number | null}
		 * @private
		 */
		this._operand2 = null;
		/**
		 * The current chosen operator.
		 * @type {OperationsType | null}
		 * @private
		 */
		this._operator = null;
		/**
		 * The output value for the operation.
		 * @type {number | null}
		 * @private
		 */
		this._output = null;
		/**
		 * The DOM node containing the value of the operand 1.
		 * @type {HTMLElement}
		 * @private
		 */
		this._operand1TxtDOMNode = operand1TxtDOMNode;
		/**
		 * The DOM node containing the value of the operand 2.
		 * @type {HTMLElement}
		 * @private
		 */
		this._operand2TxtDOMNode = operand2TxtDOMNode;
		/**
		 * The DOM node containing the value of the operator.
		 * @type {HTMLElement}
		 * @private
		 */
		this._operatorTxtDOMNode = operatorTxtDOMNode;
		/**
		 * The DOM node containing the value of the output.
		 * @type {HTMLElement}
		 * @private
		 */
		this._outputTxtDOMNode = outputTxtDOMNode;

		this._repaintDisplay();
	}

	/**
	 * Returns a number which is the input operand with its last digit removed.
	 * @param {number} operand The current operand.
	 * @returns {number | null} A number which is the input operand with its last digit removed.
	 * @private
	 */
	_removeLastDigit(operand) {
		if (operand === null) {
			return null;
		}
		const operandTxt = operand.toString();
		const updatedOperand = operandTxt.slice(0, -1);
		return updatedOperand !== null && updatedOperand !== '' ? Number(updatedOperand) : null;
	}

	/**
	 * Returns a number which is the input operand with the new digit appended to its end.
	 * @param {number} operand The current operand.
	 * @param {string} lastDigitTxt The last digit to be appended.
	 * @returns {number} A number which is the input operand with the new digit appended to its end
	 * @private
	 */
	_addLastDigit(operand, lastDigitTxt) {
		if (lastDigitTxt === '' || lastDigitTxt === null || isNaN(lastDigitTxt)) {
			return operand;
		}
		return Number(`${operand !== null ? operand.toString() : ''}` + `${lastDigitTxt}`);
	}

	/**
	 * Method to perform the given operation on the two given operands.
	 * @param {number} operand1 The first operand.
	 * @param {number} operand2 The second operand.
	 * @param {OperationsType} operation The operation to be performed on the operands.
	 * @returns {number} The output of the operation.
	 * @private
	 */
	_performOperation(operand1, operand2, operation) {
		let result = null;
		switch (operation) {
			case '+':{
				result=operand1+operand2;
				break;}
			case '-':{
				result=operand1-operand2;
				break;}
			case '*':{
				result=operand1*operand2;
				break;}
			case '/':{
				result=operand1/operand2;
				break;}
			default: {
				console.error('This operation is not supported yet!');
				break;
		}
		return result;
	}

	/**
	 * Repaints the DOM to contain the new operands and operators using the DOM elements passed to constuctor.
	 * @private
	 */
	_repaintDisplay() {
		this._operand1TxtDOMNode.innerText = this._operand1 !== null ? this._operand1.toString() : '';
		this._operand2TxtDOMNode.innerText = this._operand2 !== null ? this._operand2.toString() : '';
		this._operatorTxtDOMNode.innerText = this._operator !== null ? this._operator : '';
		this._outputTxtDOMNode.innerText = this._output !== null ? this._output.toString() : '';

		// add style to display empty dash if there is no text for operand, operator and output
		[
			{ field: this._operand1, domNode: this._operand1TxtDOMNode, className: 'empty-operand-display-box' },
			{ field: this._operand2, domNode: this._operand2TxtDOMNode, className: 'empty-operand-display-box' },
			{ field: this._operator, domNode: this._operatorTxtDOMNode, className: 'empty-operator-display-box' },
			{ field: this._output, domNode: this._outputTxtDOMNode, className: 'empty-output-display-box' }
		].forEach(({ field, domNode, className }) => {
			const parent = domNode.parentNode;
			if (field === null) {
				if (!parent.classList.contains(className)) {
					parent.classList.add(className);
				}
			} else {
				parent.classList.remove(className);
			}
		})
	}

	/**
	 * Handles AC button press by resetting all operands, operators and the output.
	 */
	pressAllClear() {
		this._operand1 = null;
		this._operand2 = null;
		this._operator = null;
		this._output = null;
		this._repaintDisplay();
	}

	/**
	 * Handle the DEL button press by removing the last digit in the current operand,
	 * removing the operator or the output, based on the current state of the calculator.
	 */
	pressDel() {
		if (this._output !== null) {
			this._output = null;
		} else if (isNaN(this._operand2)) {
			this._operand2 = null;
		} else if (this._operand2 != null && this._operator) {
			this._operand2 = this._removeLastDigit(this._operand2);
		} else if (this._operator) {
			this._operator = null;
		} else {
			this._operand1 = this._removeLastDigit(this._operand1);
		}
		this._repaintDisplay();
	}

	/**
	 * Handles the operand button press by adding the text value to the corresponding current operand.
	 * @param {string} operandTxt The text value of the operand button pressed
	 */
	pressOperand(operandTxt) {
		if (this._output !== null) {
			if (window.confirm('Do you want to clear the last output?')) {
				this.pressAllClear();
			} else {
				return;
			}
		}

		if (!this._operator) {
			this._operand1 = this._addLastDigit(this._operand1, operandTxt);
		} else {
			this._operand2 = this._addLastDigit(this._operand2, operandTxt);
		}
		this._repaintDisplay();
	}

	/**
	 * Handles the operator button press by calling the corresponding operation method.
	 * @param {OperationsType} operator The text value of the operator button pressed
	 */
	pressOperator(operator) {
		switch (operator) {
			case 'AC': {
				this.pressAllClear();
				break;
			}
			case 'DEL': {
				this.pressDel();
				break;
			}
			case '=': {
				if (this._operand1 !== null && this._operand2 !== null && this._operator !== null) {
					this._output = this._performOperation(this._operand1, this._operand2, this._operator);
				}
				break;
			}
			default: {
				if (this._operand1 !== null && this._operand2 === null) {
					// allow operator change only if operand1 is entered and operand2 is not entered yet
					this._operator = operator;
				}
				break;
			}
		}
		this._repaintDisplay();
	}
}


window.onload = function () {
	const operand1Txt = document.getElementById('operand1');
	const operand2Txt = document.getElementById('operand2');
	const operatorTxt = document.getElementById('operator');
	const outputTxt = document.getElementById('output');
	const operandBtns = document.querySelectorAll('[data-number]');
	const operationBtns = document.querySelectorAll('[data-operator]');

	const calculator = new Calculator(operand1Txt, operand2Txt, operatorTxt, outputTxt);
	operandBtns.forEach(button => {
		button.addEventListener('click', () => {
			const value = Number(button.innerText);
			if (isNaN(value)) {
				return;
			}
			calculator.pressOperand(value);
		});
	});

	operationBtns.forEach(button => {
		button.addEventListener('click', () => {
			const value = button.innerText ? button.innerText.toString() : '';
			calculator.pressOperator(value);
		});
	});
}
