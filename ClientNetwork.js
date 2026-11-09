const SCOPES = {
	SYSTEM: "SYSTEM",
	INSTANCE: "INSTANCE",
	MODULE: "MODULE",
};

export default class ClientNetwork { 
	#socket;
	#callbacks;

	constructor ( ) {
		console.log(`ClientNetwork - constructor `);
	}

	connect ( url = "ws://localhost", port = "3000" ) {
		console.log( `ClientNetwork - connect ( ${url}:${port} )` );

		this.#socket = new WebSocket( `${ url }:${ port }` );
		
		this.#socket.onopen = ( ) => { this.#handleOnOpen(); };
        this.#socket.onmessage = ( event ) => { this.#handleOnMessage( event.data ); };
        this.#socket.onerror = ( error ) => { this.#handleOnError( error ); };
        this.#socket.onclose = ( event ) => { this.#handleOnClose( event ); };
	}

	disconnect ( ) {
		this.#socket.close( );
	}

	#handleOnOpen ( ) {
		console.log( `ClientNetwork - #handleOnOpen` );

		this.#callbacks?.onOpen?.( );
    }

    #handleOnError ( error ) {
		console.log( `ClientNetwork - #handleOnError` );

        console.error( 'WebSocket error:', error );

		this.#callbacks?.onError?.( );

    }

    #handleOnClose ( event ) {
		console.log(`ClientNetwork - #handleOnClose` );

        if ( event.wasClean ) {
            console.log( `WebSocket closed cleanly, code=${ event.code }, reason=${ event.reason }` );
		} else {
            console.warn( 'WebSocket connection closed unexpectedly.' );
		}

		this.#callbacks?.onClose?.( event );
    }

    #handleOnMessage ( message ) {
		// console.log( `ClientNetwork - #handleOnMessage` );

		this.#callbacks?.onMessage?.( message );
    }

	setCallbacks ( callbacks ) {
		this.#callbacks = callbacks;
	}

	#send ( message ) {
		if ( this.#socket === undefined ) {
			return;
		}

		this.#socket.send( message );
	}

	get send ( ) {
		return this.#send.bind( this );
	}
}