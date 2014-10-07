var preview = {
	orient : 'horiz',
	current : '',
	toggle : function toggle() {
		// console.log("start: " + this.current + ' ' + this.orient);
		
		// flip toggle value
		if (this.orient == 'horiz') {
			this.orient = 'vert';
		}
		else {
			this.orient = 'horiz';
		}
		
		// refresh screen to reflect toggle
		this.resize(this.current);
	},
	resize : function resize(size) {
		if (size != this.current) {
			// console.log("start: " + this.current + ' ' + this.orient);
		}
		
		// default values dialog opened with from index.js
		var x = 1010;
		var y = 700;
		
		// adjust x and y values appropriately
		switch (size) {
			case 'max':
				x = (screen.width > 1280) ? 1170 : screen.width - 200;
				y = screen.height - 100;
				
				// desktop is only horizontal
				this.orient == 'horiz';
				
				break
			case 'tablet':
				x = 1024;
				y = 768;
				
				break
			case 'phone':
				x = 480;
				y = 320;
				
				break
		}
		
		// save what size we are
		this.current = size;
		
		if (this.orient == 'horiz') {
			studio.extension.resizeDialog(x, y);
		}
		else if (this.orient == 'vert') {
			studio.extension.resizeDialog(y, x);
		}
		
		// shutdown the menu, if showing
		$('#previewMenu:visible').click();
		
		// console.log("end: " + this.current + ' ' + this.orient);
	},
	destroy: function destroy() {
		// note that we do half here and half in studio because can't destroy the dialog (from studio) when the dialog is what spawned the call
		studio.sendCommand('Kabootit.previewDelete');
		
		// close open dialog
		studio.extension.quitDialog();
	}
}