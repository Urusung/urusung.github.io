from pathlib import Path
import argparse, subprocess
ROOT=Path(__file__).resolve().parent
parser=argparse.ArgumentParser()
parser.add_argument('--standalone-output',type=Path)
args=parser.parse_args()
subprocess.run(['npm','run','build'],cwd=ROOT,check=True)
if args.standalone_output:
 subprocess.run(['node','scripts/export-standalone.mjs',str(args.standalone_output.resolve())],cwd=ROOT,check=True)
