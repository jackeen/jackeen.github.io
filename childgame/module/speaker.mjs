/**
 * For sound effect to play
 * 
 */

class Speaker {

    audioContext;
    audioSource;
    audioSourceNode;
    
    isLoop;
    soundLevel;

    decodedBuffer;

    isLoaded = false;
    isPlay = false;

    constructor(path, isLoop, level) {
        this.audioContext = new AudioContext();
        this.audioBuffer = this.audioContext.createBufferSource();
        this.audioSource = path;
        this.isLoop = isLoop;
        this.soundLevel = level;
    }

    loadSound(callback) {
        fetch(this.audioSource).then((res) => {
            return res.arrayBuffer();
        }).then((buffer) => {
            return this.audioContext.decodeAudioData(buffer);
        }).then((buffer) => {
            this.decodedBuffer = buffer;
            this.isLoaded = true;
            callback();
        }).catch(() => {
            
        });
    }

    play() {

        let gainNode = this.audioContext.createGain();

        let sourceNode = this.audioContext.createBufferSource();
        sourceNode.loop = this.isLoop;
        sourceNode.buffer = this.decodedBuffer;

        if (isNaN(this.soundLevel)) {
            sourceNode.connect(this.audioContext.destination);
        } else {
            gainNode.gain.value = this.soundLevel;
            sourceNode.connect(gainNode);
            gainNode.connect(this.audioContext.destination);
        }
        sourceNode.start();
        
        this.audioSourceNode = sourceNode;
    }

    stop() {
        this.audioSourceNode.stop();
    }

}

export {
    Speaker,
}